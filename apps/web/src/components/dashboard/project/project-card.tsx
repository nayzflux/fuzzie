import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Card } from "~/components/ui/card";
import { Project } from "~/types/project";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/app/${project.id}`}>
      <Card className="p-4 h-[100px] sm:h-[200px]">
        <div className="flex justify-between gap-8">
          <p>{project.name}</p>

          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </div>
      </Card>
    </Link>
  );
}
