import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Jwt } from "hono/utils/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import { z } from "zod";
import { env } from "~/lib/env";
import github from "~/routes/auth/github";
import {
  createUser,
  getUser,
  getUserWithPassword,
  setUserEmailVerification,
} from "~/services/user";
import { sendEmailVerificationLink } from "~/utils/email";
import { verify } from "~/utils/password";
import { getSession, revokeSession, setSession } from "~/utils/session";

const app = new Hono();

/**
 * Email / Password
 */
const signUpBody = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(1024),
});

// TODO: Implement password entropy checks

app.post("/sign-up", zValidator("json", signUpBody), async (c) => {
  const { email, password } = c.req.valid("json");

  // Create user
  const user = await createUser(email, password);

  // Send email verification link
  await sendEmailVerificationLink(email, user.id);

  // TODO: Send email

  // Set session
  await setSession(c, user.id);

  return c.json(user, 201);
});

const signInBody = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(1024),
});

app.post("/sign-in", zValidator("json", signInBody), async (c) => {
  const { email, password } = c.req.valid("json");

  // Get user
  const user = await getUserWithPassword(email);

  // If user doesn't exists
  if (!user) throw new HTTPException(403);
  // If user doesn't have password
  if (!user.password) throw new HTTPException(403);

  // If password isn't valid
  const isValid = await verify(password, user.password);
  if (!isValid) throw new HTTPException(403);

  // Set session
  await setSession(c, user.id);

  return c.json({
    id: user.id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  });
});

app.post("/sign-out", async (c) => {
  // Revoke session
  await revokeSession(c);
  return c.json({ message: "Logged-out successfully" });
});

/**
 * Email Verification
 */
app.get("/email-verify", async (c) => {
  const token = c.req.query("token");
  if (!token) throw new HTTPException(400);

  const validatedToken = (await Jwt.verify(
    token,
    env.EMAIL_VERIFICATION_SECRET
  )) as
    | (JWTPayload & {
        id: string;
        email: string;
      })
    | undefined;
  if (!validatedToken) throw new HTTPException(400);

  await setUserEmailVerification(validatedToken.id, validatedToken.email, true);

  return c.redirect(`${env.CLIENT_URL}/email-verified`);
});

app.post("/send-email-verification-link", async (c) => {
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const user = await getUser(session.user.id);
  if (!user) throw new HTTPException(404);

  if (user.isEmailVerified) throw new HTTPException(400);

  await sendEmailVerificationLink(user.email, user.id);

  return c.json({ email: user.email }, 200);
});

/**
 * OAuth
 */
app.route("/github", github);

export default app;
