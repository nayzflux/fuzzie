import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "~/lib/env";
import auth from "~/routes/auth";
import checkout from "~/routes/checkout";
import events from "~/routes/events";
import keys from "~/routes/keys";
import projects from "~/routes/projects";
import users from "~/routes/users";
import webhook from "~/routes/webhook";

const app = new Hono().basePath("/api");

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
