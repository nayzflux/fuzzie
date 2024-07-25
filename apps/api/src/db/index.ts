import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "../lib/env";
import {
  accountTable,
  apiKeyRelations,
  apiKeyTable,
  eventRelations,
  eventTable,
  projectRelations,
  projectTable,
  sessionTable,
  userTable,
} from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
});

export const db = drizzle(client, {
  schema: {
    users: userTable,
    sessions: sessionTable,
    accounts: accountTable,
    projects: projectTable,
    apiKeys: apiKeyTable,
    events: eventTable,
    apiKeyRelations,
    projectRelations,
    eventRelations,
  },
});
