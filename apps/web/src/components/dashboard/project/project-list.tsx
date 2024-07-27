"use client";

import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useProjects } from "~/hooks/use-projects";
import CreateProjectDialog from "./create-project-dialog";
import ProjectCard from "./project-card";

export default function ProjectList() {
  const { data: projects, isPending } = useProjects();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-8">
        <Card className="p-4 h-[200px]">
          <div>
            <Skeleton className="h-4 w-40 rounded-lg" />
          </div>
        </Card>

        <Card className="p-4 h-[200px]">
          <div>
            <Skeleton className="h-4 w-40 rounded-lg" />
          </div>
        </Card>

        <Card className="p-4 h-[200px]">
          <div>
            <Skeleton className="h-4 w-40 rounded-lg" />
          </div>
        </Card>

        <Card className="p-4 h-[200px]">
          <div>
            <Skeleton className="h-4 w-40 rounded-lg" />
          </div>
        </Card>
      </div>
    );
  }

  if (projects?.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-4 h-[600px] gap-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl font-semibold">
            You don&apos;t have any projects yet.
          </p>
          <p className="text-muted-foreground">
            Start by creating a new project.
          </p>
        </div>

        <CreateProjectDialog />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-8">
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
