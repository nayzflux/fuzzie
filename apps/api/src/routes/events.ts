import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  getEventWithProject,
  getEventWithProjectAndWebhookRequests,
} from "~/services/event";
import { getSession } from "~/utils/session";

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

export default app;
