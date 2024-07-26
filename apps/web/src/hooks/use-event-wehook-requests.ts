import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { PartialWebhookRequest } from "~/types/webhook-request";

export const useEventWebhookRequests = (eventId: string) =>
  useQuery({
    queryKey: ["webhook-requests", eventId],
    queryFn: async () => {
      const res = await api.get(`events/${eventId}/webhook-requests`);
      const webhookRequests =
        (await res.json()) satisfies PartialWebhookRequest[];
      return webhookRequests;
    },
  });
