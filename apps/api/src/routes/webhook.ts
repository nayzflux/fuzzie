import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import cryto from "node:crypto";
import { db } from "~/db";
import { eventTable } from "~/db/schema";
import { env } from "~/lib/env";
import { updateEvent } from "~/services/event";
import {
  createWebhookRequest,
  updateWebhookRequest,
} from "~/services/webhook-request";
import { runWebhookRequest } from "~/trigger/run-webhook-request-task";

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

  const body = await c.req.json();

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
    const webhookRequest = body.data;

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
    const webhookRequest = body.data;

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
    const retry = body.data.retry;

    /**
     * If retry left retry else set event status to NOT_DELIVERED
     */
    if (retry <= RETRY_DELAYS.length - 1) {
      const delay = RETRY_DELAYS[retry];

      console.log(`[WEBHOOK] ${webhookRequest.eventId} retrying in ${delay}`);

      const event = await db.query.events.findFirst({
        where: eq(eventTable.id, webhookRequest.eventId),
      });

      if (!event) throw new HTTPException(404);

      const newWebhookRequest = await createWebhookRequest(event.id);

      /**
       * Schedule task
       */
      await runWebhookRequest.trigger(
        {
          url: event.webhookUrl,
          secret: event.webhookSecret,
          eventName: event.name,
          data: event.data,
          webhookRequest: newWebhookRequest,
          retry: retry + 1,
        },
        { delay }
      );
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

export default app;
