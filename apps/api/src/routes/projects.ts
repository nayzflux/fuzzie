import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import {
  createProject,
  deleteProject,
  getProject,
  getUserProjects,
  updateProject,
} from "~/services/project";
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

  const deletedProject = await deleteProject(project.id);

  return c.json(deletedProject);
});

export default app;
