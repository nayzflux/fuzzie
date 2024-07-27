import { sql } from "drizzle-orm";
import { db } from "~/db";
import { eventTable } from "~/db/schema";

export const getMonthlyTriggeredEventCount = async (projectId: string) => {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  const query = sql`SELECT COUNT(*) AS triggered, ${
    eventTable.createdAt
  } AS bucket FROM ${eventTable} WHERE ${
    eventTable.projectId
  } = ${projectId} AND created_at BETWEEN ${firstDay.getTime()} AND ${lastDay.getTime()} GROUP BY bucket`;

  return await db.all(query);
};

console.log(await getMonthlyTriggeredEventCount("p_mI7cng9wxK36"));
