import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

/**
 * Users
 */
export const userTable = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  isEmailVerified: integer("is_email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

/**
 * Sessions
 */
export const sessionTable = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(),
  expiresAt: integer("expires_at").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

/**
 * Accounts
 */
export const accountTable = sqliteTable(
  "accounts",
  {
    providerId: text("provider_id", { enum: ["GOOGLE", "GITHUB"] }).notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.providerUserId, table.providerId],
    }),
  })
);

/**
 * Projects
 */
export const projectTable = sqliteTable("project", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  usageEventTriggered: integer("usage_event_triggered").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

/**
 * API Keys
 */
export const apiKeyTable = sqliteTable("api_keys", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

export const apiKeyRelations = relations(apiKeyTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [apiKeyTable.projectId],
    references: [projectTable.id],
  }),
}));

/**
 * Events
 */
export const eventTable = sqliteTable("events", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  data: text("data", { mode: "json" }).notNull(),
  status: text("status", {
    enum: ["TRIGGERED", "REPLAYED", "DELIVERED", "NOT_DELIVERED"],
  }),
  webhookUrl: text("webhook_url").notNull(),
  webhookSecret: text("webhook_secret").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

/**
 * Webhook request
 */
export const webhookRequestTable = sqliteTable("webhook_requests", {
  id: text("id").notNull().primaryKey(),

  requestHeaders: text("request_body", { mode: "json" }),
  requestBody: text("request_body", { mode: "json" }),
  requestUrl: text("request_url"),

  responseHeaders: text("response_body", { mode: "json" }),
  responseBody: text("response_body", { mode: "json" }),
  responseCode: integer("response_code"),

  status: text("status", {
    enum: ["SCHEDULED", "SUCCEEDED", "FAILED"],
  }),

  sentAt: integer("sent_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),

  eventId: text("event_id")
    .notNull()
    .references(() => eventTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});
