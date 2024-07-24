import { eq } from "drizzle-orm";
import { db } from "~/db";
import { projectTable } from "~/db/schema";
import { newId } from "~/lib/nanoid";

export const createProject = async (name: string, userId: string) => {
  /**
   * Generate ID
   */
  const id = newId("p");
  /**
   * Get current date
   */
  const createdAt = new Date();

  /**
   * Insert project into DB
   */
  const project = await db
    .insert(projectTable)
    .values({
      id,
      name,
      usageEventTriggered: 0,
      createdAt,
      userId,
    })
    .returning()
    .get();

  console.log(`[PROJECT] ${project.name} has been created`);

  return project;
};

export const getUserProjects = async (userId: string) => {
  /**
   * Get project by user ID
   */
  return await db.query.projects.findMany({
    where: eq(projectTable.userId, userId),
  });
};

export const getProject = async (projectId: string) => {
  /**
   * Get project by ID
   */
  const project = await db.query.projects.findFirst({
    where: eq(projectTable.id, projectId),
  });

  return project;
};

export const updateProject = async (
  projectId: string,
  values: { name?: string }
) => {
  /**
   * Update project in DB
   */
  const project = await db
    .update(projectTable)
    .set(values)
    .where(eq(projectTable.id, projectId))
    .returning()
    .get();

  return project;
};

export const deleteProject = async (projectId: string) => {
  /**
   * Delete project from DB
   */
  const project = await db
    .delete(projectTable)
    .where(eq(projectTable.id, projectId))
    .returning()
    .get();

  return project;
};
