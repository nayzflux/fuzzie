import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
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
  // Subscription
  plan: text("plan", { enum: ["FREE", "PRO"] })
    .default("FREE")
    .notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  // Usage
  eventUsageCount: integer("event_usage_count", { mode: "number" })
    .default(0)
    .notNull(),
  webhookRequestUsageCount: integer("webhook_request_usage_count", {
    mode: "number",
  })
    .default(0)
    .notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  projects: many(projectTable),
  sessions: many(sessionTable),
  accounts: many(accountTable),
}));

export type NewUser = InferInsertModel<typeof userTable>;
export type User = InferSelectModel<typeof userTable>;

/**
 * Sessions
 */
export const sessionTable = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(),
  expiresAt: integer("expires_at").notNull(),
  userId: text("user_id").notNull(),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

/**
 * Accounts
 */
export const accountTable = sqliteTable(
  "accounts",
  {
    providerId: text("provider_id", { enum: ["GOOGLE", "GITHUB"] }).notNull(),
    providerUserId: text("provider_user_id").notNull(),
    userId: text("user_id").notNull(),
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.providerUserId, table.providerId],
    }),
  })
);

export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));

/**
 * Projects
 */
export const projectTable = sqliteTable("project", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  usageEventTriggered: integer("usage_event_triggered").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  userId: text("user_id").notNull(),
});

export type NewProject = InferInsertModel<typeof projectTable>;
export type Project = InferSelectModel<typeof projectTable>;

export const projectRelations = relations(projectTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [projectTable.userId],
    references: [userTable.id],
  }),
  events: many(eventTable),
  apiKeys: many(apiKeyTable),
}));

/**
 * API Keys
 */
export const apiKeyTable = sqliteTable("api_keys", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  projectId: text("project_id").notNull(),
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
  }).notNull(),
  webhookUrl: text("webhook_url").notNull(),
  webhookSecret: text("webhook_secret").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  projectId: text("project_id").notNull(),
});

export type NewEvent = InferInsertModel<typeof eventTable>;
export type Event = InferSelectModel<typeof eventTable>;

export const eventRelations = relations(eventTable, ({ one, many }) => ({
  project: one(projectTable, {
    fields: [eventTable.projectId],
    references: [projectTable.id],
  }),
  webhookRequests: many(webhookRequestTable),
}));

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
  }).notNull(),

  sentAt: integer("sent_at", { mode: "timestamp_ms" }),
  scheduledFor: integer("scheduled_for", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),

  runId: text("run_id").notNull(),
  eventId: text("event_id").notNull(),
  projectId: text("project_id").notNull(),
});

export const webhookRequestRelations = relations(
  webhookRequestTable,
  ({ one }) => ({
    event: one(eventTable, {
      fields: [webhookRequestTable.eventId],
      references: [eventTable.id],
    }),
    project: one(projectTable, {
      fields: [webhookRequestTable.projectId],
      references: [projectTable.id],
    }),
  })
);

export type NewWebhookRequest = InferInsertModel<typeof webhookRequestTable>;
export type WebhookRequest = InferSelectModel<typeof webhookRequestTable>;
