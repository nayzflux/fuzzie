import { zValidator } from "@hono/zod-validator";
import { CryptoHasher } from "bun";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { db } from "~/db";
import { apiKeyTable, eventTable, webhookRequestTable } from "~/db/schema";
import { env } from "~/lib/env";
import { newId } from "~/lib/nanoid";
import {
  createProject,
  deleteProject,
  getProject,
  getUserProjects,
  updateProject,
} from "~/services/project";
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
  data: z.unknown(),
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

    const hash = CryptoHasher.hash("sha256", apiKey, "base64");

    const key = await db.query.apiKeys.findFirst({
      where: eq(apiKeyTable.key, hash),
      with: {
        project: true,
      },
    });

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
    const event = await db
      .insert(eventTable)
      .values({
        id: newId("e"),
        name,
        data,
        webhookUrl,
        webhookSecret: encryptedWebhookSecret,
        status: "TRIGGERED",
        createdAt: new Date(),
        projectId,
      })
      .returning({
        id: eventTable.id,
        name: eventTable.name,
        data: eventTable.data,
        webhookUrl: eventTable.webhookUrl,
        status: eventTable.status,
        createdAt: eventTable.createdAt,
        projectId: eventTable.projectId,
      })
      .get();

    /**
     * Create webhook request and schedule it
     */
    const webhookRequest = await db
      .insert(webhookRequestTable)
      .values({
        id: newId("wh_req"),
        status: "SCHEDULED",
        createdAt: new Date(),
        eventId: event.id,
      })
      .returning()
      .get();

    /**
     * Run task
     * - url
     * - secret
     * - data
     * - eventName
     * - webhookRequest
     */

    await runWebhookRequest.trigger({
      url: webhookUrl,
      secret: encryptedWebhookSecret,
      eventName: name,
      data: data,
      webhookRequest,
    });

    return c.json(event, 201);
  }
);

export default app;
