import { eq } from "drizzle-orm";
import { db } from "~/db";
import {
  webhookRequestTable,
  type NewWebhookRequest,
  type WebhookRequest,
} from "~/db/schema";

export const createWebhookRequest = async (webhookRequest: NewWebhookRequest) =>
  await db.insert(webhookRequestTable).values(webhookRequest).returning().get();

export const updateWebhookRequest = async (
  id: string,
  values: Partial<WebhookRequest>
) =>
  await db
    .update(webhookRequestTable)
    .set(values)
    .where(eq(webhookRequestTable.id, id));
