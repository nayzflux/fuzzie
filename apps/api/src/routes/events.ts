import { runs } from "@trigger.dev/sdk/v3";
import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "~/db";
import { userTable, webhookRequestTable } from "~/db/schema";
import { newId } from "~/lib/nanoid";
import {
  getEventWithProject,
  getEventWithProjectAndWebhookRequests,
  getEventWithProjectAndWebhookSecret,
  updateEvent,
} from "~/services/event";
import { getUser, updateUser } from "~/services/user";
import {
  createWebhookRequest,
  updateWebhookRequest,
} from "~/services/webhook-request";
import { runWebhookRequest } from "~/trigger/run-webhook-request-task";
import { getSession } from "~/utils/session";
import { isWebhookRequestExceeded } from "~/utils/usage";

const app = new Hono();

app.get("/:eventId", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const { eventId } = c.req.param();

  /**
   * Get event with project
   */
  const event = await getEventWithProject(eventId);

  /**
   * If event doesn't exists
   */
  if (!event) throw new HTTPException(404);

  /**
   * Authorization
   */
  if (event.project.userId !== session.user.id) throw new HTTPException(403);

  return c.json(event);
});

app.get("/:eventId/webhook-requests", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const { eventId } = c.req.param();

  /**
   * Get event with project
   */
  const event = await getEventWithProjectAndWebhookRequests(eventId);

  /**
   * If event doesn't exists
   */
  if (!event) throw new HTTPException(404);

  /**
   * Authorization
   */
  if (event.project.userId !== session.user.id) throw new HTTPException(403);

  return c.json(event.webhookRequests);
});

/**
 * Replay event
 */
app.post("/:eventId/replay", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  /**
   * Email verified is required
   */
  const user = await getUser(session.user.id);
  if (!user?.isEmailVerified) throw new HTTPException(403);

  const { eventId } = c.req.param();

  /**
   * Get event with project
   */
  const event = await getEventWithProjectAndWebhookSecret(eventId);

  /**
   * If event doesn't exists
   */
  if (!event) throw new HTTPException(404);

  /**
   * Authorization
   */
  if (event.project.userId !== session.user.id) throw new HTTPException(403);

  /**
   * Check usage
   */
  if (isWebhookRequestExceeded(event.project.user))
    throw new HTTPException(422);

  /**
   * If event is not finished cancel any scheduled request
   */
  if (event.status === "TRIGGERED" || event.status === "REPLAYED") {
    const scheduledRequests = await db
      .update(webhookRequestTable)
      .set({ status: "FAILED" })
      .where(
        and(
          eq(webhookRequestTable.eventId, event.id),
          eq(webhookRequestTable.status, "SCHEDULED")
        )
      )
      .returning();

    for (const request of scheduledRequests) {
      if (request.runId) {
        await runs.cancel(request.runId);
      }
    }
  }

  try {
    const webhookRequestId = newId("wh_req");

    /**
     * Schedule task
     */
    const { id: runId } = (await runWebhookRequest.trigger({
      url: event.webhookUrl,
      secret: event.webhookSecret,
      eventName: event.name,
      data: event.data,
      webhookRequest: {
        projectId: event.projectId,
        eventId: event.id,
        id: webhookRequestId,
      },
    })) as unknown as { id: string };

    /**
     * Set event status to replayed
     */
    const newEvent = await updateEvent(event.id, { status: "REPLAYED" });

    /**
     * Insert webhook request
     */
    await createWebhookRequest({
      id: webhookRequestId,
      status: "SCHEDULED",
      createdAt: new Date(),
      scheduledFor: new Date(),
      runId: runId,
      projectId: event.projectId,
      eventId: event.id,
    });

    /**
     * Increment usage
     */
    await db
      .update(userTable)
      .set({
        eventUsageCount: sql`${userTable.eventUsageCount} + 1`,
        webhookRequestUsageCount: sql`${userTable.webhookRequestUsageCount} + 1`,
      })
      .where(eq(userTable.id, session.user.id));

    return c.json(newEvent, 200);
  } catch (err) {
    throw new HTTPException(500);
  }
});

export default app;
