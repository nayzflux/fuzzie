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
