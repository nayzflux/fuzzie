import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { Event } from "~/types/event";

export const useEvent = (eventId: string) =>
  useQuery({
    queryKey: ["events", eventId],
    queryFn: async () => {
      const res = await api.get(`events/${eventId}`);
      const event = (await res.json()) satisfies Event;
      return event;
    },
  });
