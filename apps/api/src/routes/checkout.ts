import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { db } from "~/db";
import { userTable } from "~/db/schema";
import { env } from "~/lib/env";
import { stripe } from "~/lib/stripe";
import { getSession } from "~/utils/session";

const app = new Hono();

const plans = [
  {
    id: "PRO",
    priceId: env.STRIPE_PRO_PLAN_ID,
  },
];

app.get("/", async (c) => {
  const planId = c.req.query("planId");

  if (planId !== "PRO") throw new HTTPException(400);

  const plan = plans.find((p) => p.id === planId);

  if (!plan) throw new HTTPException(404);

  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const user = await db.query.users.findFirst({
    where: eq(userTable.id, session.user.id),
    columns: {
      password: false,
    },
  });

  if (!user) throw new HTTPException(404);

  /**
   * If user already subscribed
   */
  if (user.plan === "PRO") return c.redirect(`${env.CLIENT_URL}/app`);

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: plan.priceId,
        quantity: 1,
      },
    ],
    cancel_url: `${env.CLIENT_URL}`,
    success_url: `${env.CLIENT_URL}/app`,
    customer: user.stripeCustomerId || "",
    mode: "subscription",
    metadata: {
      planId,
      userId: session.user.id,
    },
  });

  return c.redirect(checkoutSession?.url || `${env.CLIENT_URL}`);
});

export default app;
