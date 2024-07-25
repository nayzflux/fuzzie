import { eq } from "drizzle-orm";
import { db } from "~/db";
import { eventTable, type Event } from "~/db/schema";
import { newId } from "~/lib/nanoid";

export const createEvent = async (
  name: string,
  webhookUrl: string,
  encryptedWebhookSecret: string,
  data: Record<string, unknown>,
  projectId: string
) =>
  await db
    .insert(eventTable)
    .values({
      id: newId("e"),
      name,
      data,
      webhookUrl,
      webhookSecret: encryptedWebhookSecret,
      status: "TRIGGERED",
      createdAt: new Date(),
      projectId,
    })
    .returning({
      id: eventTable.id,
      name: eventTable.name,
      data: eventTable.data,
      webhookUrl: eventTable.webhookUrl,
      status: eventTable.status,
      createdAt: eventTable.createdAt,
      projectId: eventTable.projectId,
    })
    .get();

export const updateEvent = async (id: string, values: Partial<Event>) =>
  await db.update(eventTable).set(values).where(eq(eventTable.id, id));
