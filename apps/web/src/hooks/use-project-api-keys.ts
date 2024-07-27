import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { ApiKey } from "~/types/api-key";

export const useProjectApiKeys = (projectId: string) =>
  useQuery({
    queryKey: ["api-keys", projectId],
    queryFn: async () => {
      const res = await api.get(`projects/${projectId}/keys`);
      const apiKeys = (await res.json()) satisfies ApiKey[];
      return apiKeys;
    },
  });
