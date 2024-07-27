import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { deleteApiKey, getApiKeyWithProjectById } from "~/services/keys";
import { getSession } from "~/utils/session";

const app = new Hono();

/**
 * Delete API key
 */
app.delete("/:keyId", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const { keyId } = c.req.param();

  /**
   * Get project
   */
  const key = await getApiKeyWithProjectById(keyId);

  /**
   * If project doesn't exists
   */
  if (!key) throw new HTTPException(404);

  /**
   * Authorization
   */
  if (key.project.userId !== session.user.id) throw new HTTPException(403);

  /**
   * Delete API key
   */

  await deleteApiKey(key.id);

  return c.json(key);
});

export default app;
