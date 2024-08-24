import { sql } from "drizzle-orm";
import { db } from "~/db";
import { eventTable, webhookRequestTable } from "~/db/schema";

export const getAllTimeTriggeredEventCount = async (projectId: string) => {
  const query = sql`SELECT COUNT(*) AS allTimeEventCount FROM ${eventTable} WHERE ${eventTable.projectId} = ${projectId}`;
  return await db.get(query);
};

export const getMonthlyTriggeredEventCount = async (projectId: string) => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  const query = sql`SELECT COUNT(*) AS monthlyEventCount FROM ${eventTable} WHERE ${
    eventTable.projectId
  } = ${projectId} AND created_at BETWEEN ${firstDay.getTime()} AND ${lastDay.getTime()}`;

  return await db.get(query);
};

export const getAllTimeWebhookRequestCount = async (projectId: string) => {
  const query = sql`SELECT COUNT(*) AS allTimeWebhookRequestCount FROM ${webhookRequestTable} WHERE ${webhookRequestTable.projectId} = ${projectId}`;
  return await db.get(query);
};

export const getMonthlyWebhookRequestCount = async (projectId: string) => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  const query = sql`SELECT COUNT(*) AS monthlyWebhookRequestCount FROM ${webhookRequestTable} WHERE ${
    webhookRequestTable.projectId
  } = ${projectId} AND created_at BETWEEN ${firstDay.getTime()} AND ${lastDay.getTime()}`;

  return await db.get(query);
};

export const getTriggeredEventTimeseries = async (
  projectId: string,
  start: Date,
  end: Date,
  interval: "DAY" | "HOUR" | "MINUTE"
) => {
  let x;

  switch (interval) {
    case "MINUTE":
      x = 5 * 60 * 1000;
      break;
    case "HOUR":
      x = 60 * 60 * 1000;
      break;
    case "DAY":
      x = 24 * 60 * 60 * 1000;
      break;
  }

  const bucketStart = Math.floor(start.getTime() / x);
  const bucketEnd = Math.floor(end.getTime() / x);

  const query = sql`SELECT COUNT(*) AS eventCount, ${
    eventTable.createdAt
  } AS datetime, FLOOR(${
    eventTable.createdAt
  } / (${x})) AS bucket FROM ${eventTable} WHERE ${
    eventTable.projectId
  } = ${projectId} AND created_at BETWEEN ${start.getTime()} AND ${end.getTime()} GROUP BY bucket`;

  const data = await db.all<{
    bucket: number;
    datetime: number;
    eventCount: number;
  }>(query);

  let i = bucketStart;

  while (i <= bucketEnd) {
    const exists = data.find((e) => e.bucket === i);
    if (!exists) {
      data.push({ bucket: i, datetime: i * x, eventCount: 0 });
    }
    i++;
  }

  return data;
};

export const getWebhookRequestTimeseries = async (
  projectId: string,
  start: Date,
  end: Date,
  interval: "DAY" | "HOUR" | "MINUTE"
) => {
  let x;

  switch (interval) {
    case "MINUTE":
      x = 5 * 60 * 1000;
      break;
    case "HOUR":
      x = 60 * 60 * 1000;
      break;
    case "DAY":
      x = 24 * 60 * 60 * 1000;
      break;
  }

  const bucketStart = Math.floor(start.getTime() / x);
  const bucketEnd = Math.floor(end.getTime() / x);

  const query = sql`SELECT
    SUM(CASE WHEN status = 'SUCCEEDED' THEN 1 ELSE 0 END) AS succeededCount,
    SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS failedCount, ${
      webhookRequestTable.createdAt
    } AS datetime, FLOOR(${
    webhookRequestTable.createdAt
  } / (${x})) AS bucket FROM ${webhookRequestTable} WHERE ${
    webhookRequestTable.projectId
  } = ${projectId} AND created_at BETWEEN ${start.getTime()} AND ${end.getTime()} GROUP BY bucket`;

  const data = await db.all<{
    bucket: number;
    datetime: number;
    succeededCount: number;
    failedCount: number;
  }>(query);

  let i = bucketStart;

  while (i <= bucketEnd) {
    const exists = data.find((e) => e.bucket === i);
    if (!exists) {
      data.push({
        bucket: i,
        datetime: i * x,
        succeededCount: 0,
        failedCount: 0,
      });
    }
    i++;
  }

  return data;
};
