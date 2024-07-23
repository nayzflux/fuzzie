import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "../lib/env";
import { accountTable, projectTable, sessionTable, userTable } from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
});

export const db = drizzle(client, {
  schema: {
    users: userTable,
    sessions: sessionTable,
    accounts: accountTable,
    projects: projectTable,
  },
});
