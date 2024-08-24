import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { TimeSpan } from "lucia";
import cryto from "node:crypto";
import type { TimeSpanUnit } from "oslo";
import { db } from "~/db";
import { userTable } from "~/db/schema";
import { env } from "~/lib/env";
import { newId } from "~/lib/nanoid";
import { stripe } from "~/lib/stripe";
import {
  getEventWithProjectAndWebhookSecret,
  updateEvent,
} from "~/services/event";
import { updateUser, updateUserBySubscriptionId } from "~/services/user";
import {
  createWebhookRequest,
  updateWebhookRequest,
} from "~/services/webhook-request";
import { runWebhookRequest } from "~/trigger/run-webhook-request-task";
import type {
  InternalEvent,
  InternalWebhookRequestEventData,
} from "~/types/internal-event";
import { isWebhookRequestExceeded } from "~/utils/usage";

const app = new Hono();

const RETRY_DELAYS = [
  "30s",
  "1m",
  "5m",
  "10m",
  "30m",
  "1h",
  "2h",
  "3h",
  "6h",
  "12h",
  "24h",
  "72h",
  "7d",
];

app.post("/internal", async (c) => {
  /**
   * Get original signature
   */
  const signature = c.req.header("Signature");
  if (!signature) throw new HTTPException(403);

  const body = (await c.req.json()) satisfies InternalEvent;

  /**
   * Compute signature
   */
  const sig = cryto
    .createHmac("sha256", env.INTERNAL_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest("base64");

  /**
   * Compare signature
   */
  if (sig !== signature) throw new HTTPException(403);

  // TODO: Check exp
  const event = body.event;

  /**
   * On success
   */
  if (event === "webhook_request.succeeded") {
    const webhookRequest = body.data as InternalWebhookRequestEventData;

    console.log(`[WEBHOOK] ${webhookRequest.id} succeeded`);

    /**
     * Set event status to DELIVERED
     */
    await updateEvent(webhookRequest.eventId, { status: "DELIVERED" });

    /**
     * Set webhook request status to SUCCEEDED
     */
    await updateWebhookRequest(webhookRequest.id, {
      status: "SUCCEEDED",

      sentAt: new Date(webhookRequest.sentAt),

      requestUrl: webhookRequest.requestUrl,
      requestHeaders: webhookRequest.requestHeaders,
      requestBody: webhookRequest.requestBody,

      responseHeaders: webhookRequest.responseHeaders,
      responseBody: webhookRequest.responseBody,
      responseCode: webhookRequest.responseCode,
    });

    return c.json({}, 200);
  }

  /**
   * On error
   */
  if (event === "webhook_request.failed") {
    const webhookRequest = body.data as InternalWebhookRequestEventData;

    console.log(
      `[WEBHOOK] ${webhookRequest.eventId} - ${webhookRequest.id} failed`
    );

    /**
     * Set webhook request status to FAILED
     */
    await updateWebhookRequest(webhookRequest.id, {
      status: "FAILED",

      sentAt: new Date(webhookRequest.sentAt),

      requestUrl: webhookRequest.requestUrl,
      requestHeaders: webhookRequest.requestHeaders,
      requestBody: webhookRequest.requestBody,

      responseHeaders: webhookRequest.responseHeaders,
      responseBody: webhookRequest.responseBody,
      responseCode: webhookRequest.responseCode,
    });

    /**
     * Handle retry
     */
    const retry = webhookRequest.retry;

    /**
     * If retry left retry else set event status to NOT_DELIVERED
     */
    if (retry <= RETRY_DELAYS.length - 1) {
      const delay = RETRY_DELAYS[retry];

      console.log(`[WEBHOOK] ${webhookRequest.eventId} retrying in ${delay}`);

      const event = await getEventWithProjectAndWebhookSecret(
        webhookRequest.eventId
      );

      if (!event) throw new HTTPException(404);

      /**
       * Check usage
       */
      if (isWebhookRequestExceeded(event.project.user))
        throw new HTTPException(422);

      const unit = delay[delay.length - 1] as TimeSpanUnit;
      const amount = parseInt(delay.slice(0, delay.length - 1));

      const scheduledFor = new Date(
        Date.now() + new TimeSpan(amount, unit).milliseconds()
      );

      try {
        const webhookRequestId = newId("wh_req");

        /**
         * Schedule task
         */
        const { id: runId } = (await runWebhookRequest.trigger(
          {
            url: event.webhookUrl,
            secret: event.webhookSecret,
            eventName: event.name,
            data: event.data,
            webhookRequest: {
              id: webhookRequestId,
              projectId: event.projectId,
              eventId: event.id,
            },
            retry: retry + 1,
          },
          { delay }
        )) as unknown as { id: string };

        /**
         * Insert webhook request
         */
        await createWebhookRequest({
          id: webhookRequestId,
          status: "SCHEDULED",
          scheduledFor: scheduledFor,
          createdAt: new Date(),
          projectId: event.projectId,
          eventId: event.id,
          runId: runId,
        });

        /**
         * Increment usage
         */
        await db
          .update(userTable)
          .set({
            webhookRequestUsageCount: sql`${userTable.webhookRequestUsageCount} + 1`,
          })
          .where(eq(userTable.id, event.project.userId));
      } catch (err) {
        throw new HTTPException(500);
      }
    } else {
      console.log(`[WEBHOOK] ${webhookRequest.eventId} not delivered`);

      /**
       * If no retry left set event status to NOT_DELIVERED
       */
      await updateEvent(webhookRequest.eventId, { status: "DELIVERED" });
    }

    return c.json({}, 200);
  }

  return c.json({}, 200);
});

app.post("/stripe", async (c) => {
  const signature = c.req.header("stripe-signature");

  if (!signature) {
    throw new HTTPException(400);
  }

  const body = await c.req.text();
  const event = await stripe.webhooks.constructEventAsync(
    body,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );

  /**
   * When user subscribe
   */
  if (event.type === "checkout.session.completed") {
    const { planId, userId } = event.data.object.metadata as {
      planId: "PRO";
      userId: string;
    };
    const subscriptionId = event.data.object.subscription as string;

    /**
     * Set user plan
     */
    await updateUser(userId, {
      plan: planId,
      stripeSubscriptionId: subscriptionId,
    });

    console.log(`[STRIPE] ${userId} subscribed to ${planId}`);
  }

  /**
   * When subscription expired or canceled
   */
  if (event.type === "customer.subscription.deleted") {
    const subscriptionId = event.data.object.id;

    /**
     * Revoke user plan
     */
    await updateUserBySubscriptionId(subscriptionId, { plan: "FREE" });
    console.log(`[STRIPE] ${subscriptionId} unsubscribed`);
  }

  return c.json({}, 200);
});

export default app;
