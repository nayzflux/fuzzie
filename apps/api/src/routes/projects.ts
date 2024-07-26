import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { db } from "~/db";
import { webhookRequestTable } from "~/db/schema";
import { env } from "~/lib/env";
import { getApiKeyWithProject } from "~/services/api-keys";
import { createEvent } from "~/services/event";
import {
  createProject,
  deleteProject,
  getProject,
  getProjectEvents,
  getUserProjects,
  updateProject,
} from "~/services/project";
import { createWebhookRequest } from "~/services/webhook-request";
import { runWebhookRequest } from "~/trigger/run-webhook-request-task";
import { encrypt } from "~/utils/encryption";
import { getSession } from "~/utils/session";

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
     * Encrypt webhook secret using AES-256 GCM
     */
    const encryptedWebhookSecret = encrypt(
      webhookSecret,
      env.WEBHOOK_SECRET_SECRET
    );

    /**
     * Create event
     */
    const event = await createEvent(
      name,
      webhookUrl,
      encryptedWebhookSecret,
      data,
      projectId
    );

    /**
     * Create webhook request and schedule it
     */
    const webhookRequest = await createWebhookRequest(event.id, new Date());

    /**
     * Run task
     */
    const { id: runId } = (await runWebhookRequest.trigger({
      url: webhookUrl,
      secret: encryptedWebhookSecret,
      eventName: name,
      data: data,
      webhookRequest,
    })) as unknown as { id: string };

    /**
     * Update run ID
     */
    await db
      .update(webhookRequestTable)
      .set({
        runId,
      })
      .where(eq(webhookRequestTable.id, webhookRequest.id));

    return c.json(event, 201);
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

export default app;
