import { useQuery } from "@tanstack/react-query";
import { PartialProject } from "~/types/project";

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await new Promise<{ json: () => Promise<unknown> }>(
        (resolve, reject) => {
          setTimeout(() => {
            resolve({
              json: () =>
                new Promise<unknown>((resolve) => {
                  resolve([
                    {
                      id: "p_a",
                      name: "Project 1",
                    },
                    {
                      id: "p_b",
                      name: "Project 2",
                    },
                    {
                      id: "p_c",
                      name: "Project 3",
                    },
                  ]);
                }),
            }),
              2000;
          });
        }
      );
      const projects = (await res.json()) as PartialProject[];
      return projects;
    },
  });
