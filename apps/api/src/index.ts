import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "hono/bun";
import { cors } from "hono/cors";
import { env } from "~/lib/env";
import auth from "~/routes/auth";
import checkout from "~/routes/checkout";
import events from "~/routes/events";
import keys from "~/routes/keys";
import projects from "~/routes/projects";
import users from "~/routes/users";
import webhook from "~/routes/webhook";

// 100 request per 15 mins
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-6",
  keyGenerator: async (c) => {
    const info = getConnInfo(c);
    return info.remote.address || "";
  },
});

// 10 request per hours
const authLimiter = rateLimiter({
  windowMs: 1 * 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-6",
  keyGenerator: async (c) => {
    const info = getConnInfo(c);
    return info.remote.address || "";
  },
});

const app = new Hono().basePath("/api");

/**
 * Rate Limit
 */
app.use(limiter);
app.use("/auth", authLimiter);

/**
 * CORS
 */
app.use(
  cors({
    origin: env.CLIENT_URL,
    allowMethods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);

/**
 * Routes
 */
app.route("/auth", auth);
app.route("/users", users);
app.route("/projects", projects);
app.route("/events", events);
app.route("/keys", keys);
app.route("/checkout", checkout);
app.route("/webhook", webhook);

/**
 * Listen on port 5000
 */
Bun.serve({
  fetch: app.fetch,
  port: 5000,
});

console.log("Server listening on http://localhost:5000");
