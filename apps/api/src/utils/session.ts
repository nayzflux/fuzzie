import type { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { env } from "~/lib/env";
import { lucia } from "~/lib/lucia";

export const setSession = async (c: Context, userId: string) => {
  // Create session
  const session = await lucia.createSession(userId, {});
  // Create session cookie
  const cookie = lucia.createSessionCookie(session.id);

  // Store session ID in cookie
  await setSignedCookie(
    c,
    cookie.name,
    cookie.value,
    env.SESSION_COOKIE_SECRET,
    cookie.attributes
  );
};

export const getSession = async (c: Context) => {
  // Get session ID from cookie
  const sessionId = await getSignedCookie(
    c,
    env.SESSION_COOKIE_SECRET,
    lucia.sessionCookieName
  );
  if (!sessionId) throw new HTTPException(401);

  // Validate session
  const session = await lucia.validateSession(sessionId);
  if (!session.session || !session.user?.id) throw new HTTPException(401);

  return session;
};

export const revokeSession = async (c: Context) => {
  const session = await getSession(c);

  // Invalidate session
  if (session) {
    await lucia.invalidateSession(session.session.id);
  }

  // Create blanck cookie
  const cookie = lucia.createBlankSessionCookie();

  // Delete session cookie
  await setSignedCookie(
    c,
    cookie.name,
    cookie.value,
    env.SESSION_COOKIE_SECRET,
    cookie.attributes
  );
};
