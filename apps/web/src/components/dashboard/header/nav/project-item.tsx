"use client";

import { Slash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { useProjects } from "~/hooks/use-projects";

export default function ProjectItem() {
  const params = useParams() as { projectId?: string };
  const { push } = useRouter();
  const { data: projects, isPending } = useProjects();

  if (!params.projectId) return null;

  return (
    <>
      <BreadcrumbSeparator>
        <Slash />
      </BreadcrumbSeparator>

      <BreadcrumbItem>
        {isPending ? (
          <Skeleton className="w-60 h-5" />
        ) : (
          <BreadcrumbPage>
            <Select
              defaultValue={params.projectId}
              onValueChange={(id) => push(`/app/${id}`)}
            >
              <SelectTrigger className="border-none">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {projects?.map(({ id, name }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </BreadcrumbPage>
        )}
      </BreadcrumbItem>
    </>
  );
}
