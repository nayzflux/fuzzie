import { desc, eq } from "drizzle-orm";
import { db } from "~/db";
import { eventTable, webhookRequestTable, type Event } from "~/db/schema";
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

export const getEventWithProject = async (id: string) =>
  db.query.events.findFirst({
    where: eq(eventTable.id, id),
    with: {
      project: true,
    },
    columns: {
      webhookSecret: false,
    },
  });

export const getEventWithProjectAndWebhookSecret = async (id: string) =>
  db.query.events.findFirst({
    where: eq(eventTable.id, id),
    with: {
      project: {
        with: {
          user: {
            columns: {
              eventUsageCount: true,
              webhookRequestUsageCount: true,
              plan: true,
            },
          },
        },
      },
    },
  });

export const getEventWithProjectAndWebhookRequests = async (id: string) =>
  await db.query.events.findFirst({
    where: eq(eventTable.id, id),
    with: {
      project: true,
      webhookRequests: {
        orderBy: desc(webhookRequestTable.createdAt),
      },
    },
    columns: {
      webhookSecret: false,
    },
  });
