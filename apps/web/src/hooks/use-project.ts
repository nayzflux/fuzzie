import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { Project } from "~/types/project";

export const useProject = (projectId: string) =>
  useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const res = await api.get(`projects/${projectId}`);
      const project = (await res.json()) satisfies Project;
      return project;
    },
  });
