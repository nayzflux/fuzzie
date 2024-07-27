import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { env } from "~/lib/env";
import { stripe } from "~/lib/stripe";
import {
  deleteUser,
  getUser,
  getUserWithStripeInfo,
  updateUser,
} from "~/services/user";
import { sendEmailVerificationLink } from "~/utils/email";
import { getSession } from "~/utils/session";

const app = new Hono();

/**
 * Get current user
 */
app.get("/me", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const user = await getUser(session.user.id);

  return c.json(user, 200);
});

/**
 * Update user
 */
const updateUserBody = z.object({
  email: z.string().email().max(320).optional(),
});

app.patch("/:userId", zValidator("json", updateUserBody), async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const userId = c.req.param("userId");
  const data = c.req.valid("json");

  /**
   * Authorization
   */
  if (session.user.id !== userId) throw new HTTPException(403);

  const user = await updateUser(userId, {
    ...data,
    isEmailVerified: data.email ? false : undefined,
  });

  /**
   * If user update his email then do email verification
   */
  if (data.email) {
    await sendEmailVerificationLink(data.email, userId);
  }

  return c.json(user);
});

/**
 * Delete user
 */
app.delete("/:userId", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const userId = c.req.param("userId");

  /**
   * Authorization
   */
  if (session.user.id !== userId) throw new HTTPException(403);

  // Delete user
  const user = await deleteUser(userId);

  return c.json(user);
});

/**
 * Access to customer portal
 */
app.get("/:userId/customer-portal", async (c) => {
  /**
   * Authentication
   */
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const userId = c.req.param("userId");

  /**
   * Authorization
   */
  if (session.user.id !== userId) throw new HTTPException(403);

  const user = await getUserWithStripeInfo(session.user.id);

  if (!user?.stripeCustomerId) throw new HTTPException(404);

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${env.CLIENT_URL}/account/subscription`,
  });

  return c.redirect(portal.url);
});

export default app;
