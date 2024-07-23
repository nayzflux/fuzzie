import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { getUser } from "~/services/user";
import { getSession } from "~/utils/session";

const app = new Hono();

app.get("/me", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const user = await getUser(session.user.id);

  return c.json(user, 200);
});

export default app;
