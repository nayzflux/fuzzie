"use client";

import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useProject } from "~/hooks/use-project";
import DeleteProjectDialog from "./delete-project-dialog";
import UpdateProjectNameForm from "./update-project-name-form";

export default function SettingsPage() {
  const { projectId } = useParams() as { projectId: string };
  const { data: project, isPending } = useProject(projectId);

  return (
    <div className="flex flex-col gap-8 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Project name</CardTitle>
        </CardHeader>

        <CardContent>
          {isPending || !project ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-9 w-full" />

              <div className="flex justify-end">
                <Button variant="outline" disabled>
                  Save changes
                </Button>
              </div>
            </div>
          ) : (
            <UpdateProjectNameForm projectName={project.name} />
          )}
        </CardContent>
      </Card>

      <Card className="border-red-600">
        <CardHeader>
          <CardTitle>Delete project</CardTitle>
          <CardDescription>
            This will delete this project and related data from our server
          </CardDescription>
        </CardHeader>

        <CardFooter className="border-t border-red-600 pt-6">
          <div className="ml-auto">
            <DeleteProjectDialog />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
