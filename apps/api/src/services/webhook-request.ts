import { eq } from "drizzle-orm";
import { db } from "~/db";
import { webhookRequestTable, type WebhookRequest } from "~/db/schema";
import { newId } from "~/lib/nanoid";

export const createWebhookRequest = async (
  eventId: string,
  projectId: string,
  scheduledFor: Date
) =>
  await db
    .insert(webhookRequestTable)
    .values({
      id: newId("wh_req"),
      status: "SCHEDULED",
      createdAt: new Date(),
      eventId,
      projectId,
      scheduledFor,
    })
    .returning()
    .get();

export const updateWebhookRequest = async (
  id: string,
  values: Partial<WebhookRequest>
) =>
  await db
    .update(webhookRequestTable)
    .set(values)
    .where(eq(webhookRequestTable.id, id));
