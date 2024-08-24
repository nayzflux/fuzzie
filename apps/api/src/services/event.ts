import { desc, eq } from "drizzle-orm";
import { db } from "~/db";
import {
  eventTable,
  webhookRequestTable,
  type Event,
  type NewEvent,
} from "~/db/schema";

export const createEvent = async (event: NewEvent) =>
  await db
    .insert(eventTable)
    .values(event)
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
  await db
    .update(eventTable)
    .set(values)
    .where(eq(eventTable.id, id))
    .returning()
    .get();

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
