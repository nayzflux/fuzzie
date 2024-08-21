import { logger, schedules } from "@trigger.dev/sdk/v3";
import { db } from "~/db";
import { userTable } from "~/db/schema";

export const resetUsageTask = schedules.task({
  id: "reset-usage",
  /**
   * Run the 1st of every month
   */
  cron: "0 0 1 * *",
  run: async (payload) => {
    logger.info("Resetting monthly usage...");

    /**
     * Reset usage of every user
     */
    await db.update(userTable).set({
      eventUsageCount: 0,
      webhookRequestUsageCount: 0,
    });

    logger.info("Usage have been reset!");
  },
});
