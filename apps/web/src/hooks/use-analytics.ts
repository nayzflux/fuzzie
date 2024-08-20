import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";

export const useAnalytics = (
  projectId: string,
  from: Date,
  to: Date,
  by: "DAY" | "HOUR" | "MINUTE"
) =>
  useQuery({
    queryKey: ["analytics", projectId],
    queryFn: async () => {
      const res = await api.get(
        `projects/${projectId}/analytics?from=${from.getTime()}&to=${to.getTime()}&by=${by}`
      );
      const project = (await res.json()) satisfies {
        allTimeEventCount: number;
        monthlyEventCount: number;
        allTimeWebhookRequestCount: number;
        monthlyWebhookRequestCount: number;
        events: {
          eventCount: number;
          datetime: string;
        }[];
        webhookRequests: {
          succeededCount: number;
          failedCount: number;
          datetime: string;
        }[];
      };
      return project;
    },
  });
