import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { Project } from "~/types/project";

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get(`projects`);
      const projects = (await res.json()) as Project[];
      return projects;
    },
  });
