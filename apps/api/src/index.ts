import { Hono } from "hono";
import auth from "~/routes/auth";
import users from "~/routes/users";

const app = new Hono().basePath("/api");

app.route("/auth", auth);
app.route("/users", users);

/**
 * Listen on port 5000
 */
Bun.serve({
  fetch: app.fetch,
  port: 5000,
});

console.log("Server listening on http://localhost:5000");
