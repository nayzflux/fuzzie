import { zValidator } from "@hono/zod-validator";
import { eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { db } from "~/db";
import { userTable } from "~/db/schema";
import { env } from "~/lib/env";
import { newId } from "~/lib/nanoid";
import {
  getAllTimeTriggeredEventCount,
  getAllTimeWebhookRequestCount,
  getMonthlyTriggeredEventCount,
  getMonthlyWebhookRequestCount,
  getTriggeredEventTimeseries,
  getWebhookRequestTimeseries,
} from "~/services/analytics";
import { createEvent } from "~/services/event";
import { createApiKey, getApiKeyWithProject } from "~/services/keys";
import {
  createProject,
  deleteProject,
  getProject,
  getProjectApiKeys,
  getProjectEvents,
  getUserProjects,
  updateProject,
} from "~/services/project";
import { getUser } from "~/services/user";
import { createWebhookRequest } from "~/services/webhook-request";
import { runWebhookRequest } from "~/trigger/run-webhook-request-task";
import { encrypt } from "~/utils/encryption";
import { getSession } from "~/utils/session";
import { isEventExceeded, isWebhookRequestExceeded } from "~/utils/usage";

const app = new Hono();

/**
 * Create project
 */
const createProjectBody = z.object({
  name: z.string().min(1).max(32),
});

app.post("/", zValidator("json", createProjectBody), async (c) => {
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

  const { name } = c.req.valid("json");

  /**
   * Create project
   */
  const project = await createProject(name, session.user.id);

  return c.json(project, 201);
});

/**
 * Get project
 */
app.get("/", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  /**
   * Get all projects
   */
  const projects = await getUserProjects(session.user.id);

  return c.json(projects);
});

/**
 * Get project
 */
app.get("/:projectId", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const { projectId } = c.req.param();

  /**
   * Get all user projects
   */
  const project = await getProject(projectId);

  /**
   * If project doesn't exists
   */
  if (!project) throw new HTTPException(404);

  /**
   * Authorization
   */
  if (project.userId !== session.user.id) throw new HTTPException(403);

  return c.json(project);
});

/**
 * Update project
 */
const updateProjectBody = z.object({
  name: z.string().min(1).max(32).optional(),
});

app.patch("/:projectId", zValidator("json", updateProjectBody), async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const data = c.req.valid("json");
  const { projectId } = c.req.param();

  /**
   * Get project
   */
  const project = await getProject(projectId);

  /**
   * If project doesn't exists
   */
  if (!project) throw new HTTPException(404);

  /**
   * Authorization
   */
  if (project.userId !== session.user.id) throw new HTTPException(403);

  /**
   * Update project
   */
  const updatedProject = await updateProject(project.id, data);

  return c.json(updatedProject);
});

/**
 * Delete project
 */
app.delete("/:projectId", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const { projectId } = c.req.param();

  /**
   * Get all user projects
   */
  const project = await getProject(projectId);

  /**
   * If project doesn't exists
   */
  if (!project) throw new HTTPException(404);

  /**
   * Authorization
   */
  if (project.userId !== session.user.id) throw new HTTPException(403);

  /**
   * Delete project
   */
  const deletedProject = await deleteProject(project.id);

  return c.json(deletedProject);
});

/**
 * Ingest event
 */
const triggerEventBody = z.object({
  name: z.string().min(1).max(32),
  data: z.record(z.unknown()),
  webhookUrl: z.string().url().min(1).max(1024),
  webhookSecret: z.string().min(1).max(1024),
});

app.post(
  "/:projectId/events",
  zValidator("json", triggerEventBody),
  async (c) => {
    /**
     * API key authentication
     */
    const apiKey = c.req.header("X-API-Key");
    if (!apiKey) throw new HTTPException(401);

    const key = await getApiKeyWithProject(apiKey);

    if (!key) throw new HTTPException(401);

    const { projectId } = c.req.param();

    const { name, data, webhookUrl, webhookSecret } = c.req.valid("json");

    /**
     * Authorization
     */
    if (projectId !== key.project.id) throw new HTTPException(403);

    /**
     * Check usage
     */
    if (isEventExceeded(key.project.user)) throw new HTTPException(422);
    if (isWebhookRequestExceeded(key.project.user))
      throw new HTTPException(422);

    /**
     * Encrypt webhook secret using AES-256 GCM
     */
    const encryptedWebhookSecret = encrypt(
      webhookSecret,
      env.WEBHOOK_SECRET_SECRET
    );

    try {
      const eventId = newId("e");
      const webhookRequestId = newId("wh_req");

      /**
       * Schedule task
       */
      const { id: runId } = (await runWebhookRequest.trigger({
        url: webhookUrl,
        secret: encryptedWebhookSecret,
        eventName: name,
        data: data,
        webhookRequest: {
          projectId,
          eventId,
          id: webhookRequestId,
        },
      })) as unknown as { id: string };

      /**
       * Insert event
       */
      const event = await createEvent({
        id: eventId,
        name: name,
        data: data,
        webhookUrl: webhookUrl,
        webhookSecret: encryptedWebhookSecret,
        status: "TRIGGERED",
        createdAt: new Date(),
        projectId: projectId,
      });

      /**
       * Insert webhook request
       */
      await createWebhookRequest({
        id: webhookRequestId,
        status: "SCHEDULED",
        createdAt: new Date(),
        scheduledFor: new Date(),
        runId: runId,
        projectId: projectId,
        eventId: eventId,
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
        .where(eq(userTable.id, key.project.userId));

      return c.json(event, 201);
    } catch (err) {
      throw new HTTPException(500);
    }
  }
);

/**
 * Get project events
 */
app.get("/:projectId/events", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const { projectId } = c.req.param();

  /**
   * Get project events
   */
  const project = await getProjectEvents(projectId);

  /**
   * If project doesn't exists
   */
  if (!project) throw new HTTPException(404);

  /**
   * Authorization
   */
  if (project.userId !== session.user.id) throw new HTTPException(403);

  return c.json(project.events);
});

/**
 * Create project API key
 */
const createApiKeyBody = z.object({
  name: z.string().min(1).max(32),
});

app.post(
  "/:projectId/keys",
  zValidator("json", createApiKeyBody),
  async (c) => {
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

    const { projectId } = c.req.param();

    /**
     * Get project
     */
    const project = await getProject(projectId);

    /**
     * If project doesn't exists
     */
    if (!project) throw new HTTPException(404);

    /**
     * Authorization
     */
    if (project.userId !== session.user.id) throw new HTTPException(403);

    const { name } = c.req.valid("json");

    const apiKey = await createApiKey(name, project.id);

    return c.json(apiKey, 201);
  }
);

/**
 * Get project API keys
 */
app.get("/:projectId/keys", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const { projectId } = c.req.param();

  /**
   * Get project
   */
  const project = await getProjectApiKeys(projectId);

  /**
   * If project doesn't exists
   */
  if (!project) throw new HTTPException(404);

  /**
   * Authorization
   */
  if (project.userId !== session.user.id) throw new HTTPException(403);

  return c.json(project.apiKeys);
});

const getAnalyticsQuery = z.object({
  from: z
    .string()
    .transform((s) => parseInt(s))
    .transform((i) => new Date(i)),
  to: z
    .string()
    .transform((s) => parseInt(s))
    .transform((i) => new Date(i)),
  by: z.enum(["DAY", "HOUR", "MINUTE"]),
});

/**
 * Get project analytics
 */
app.get(
  "/:projectId/analytics",
  zValidator("query", getAnalyticsQuery),
  async (c) => {
    /**
     * Authentication
     */
    const session = await getSession(c);
    if (!session) throw new HTTPException(401);

    const { projectId } = c.req.param();

    /**
     * Get project
     */
    const project = await getProject(projectId);

    /**
     * If project doesn't exists
     */
    if (!project) throw new HTTPException(404);

    /**
     * Authorization
     */
    if (project.userId !== session.user.id) throw new HTTPException(403);

    const { from, to, by } = c.req.valid("query");

    const { monthlyEventCount } = (await getMonthlyTriggeredEventCount(
      project.id
    )) as {
      monthlyEventCount: number;
    };

    const { allTimeEventCount } = (await getAllTimeTriggeredEventCount(
      project.id
    )) as {
      allTimeEventCount: number;
    };

    const { monthlyWebhookRequestCount } = (await getMonthlyWebhookRequestCount(
      project.id
    )) as {
      monthlyWebhookRequestCount: number;
    };

    const { allTimeWebhookRequestCount } = (await getAllTimeWebhookRequestCount(
      project.id
    )) as {
      allTimeWebhookRequestCount: number;
    };

    const events = await getTriggeredEventTimeseries(project.id, from, to, by);
    const webhookRequests = await getWebhookRequestTimeseries(
      project.id,
      from,
      to,
      by
    );

    return c.json({
      allTimeEventCount,
      monthlyEventCount,
      allTimeWebhookRequestCount,
      monthlyWebhookRequestCount,
      events,
      webhookRequests,
    });
  }
);

export default app;
