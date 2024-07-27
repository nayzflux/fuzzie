import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { PartialEvent } from "~/types/event";

export const useProjectEvents = (projectId: string) =>
  useQuery({
    queryKey: ["events", projectId],
    queryFn: async () => {
      const res = await api.get(`projects/${projectId}/events`);
      const events = (await res.json()) satisfies PartialEvent[];
      return events;
    },
    refetchInterval: 30 * 1000,
  });
