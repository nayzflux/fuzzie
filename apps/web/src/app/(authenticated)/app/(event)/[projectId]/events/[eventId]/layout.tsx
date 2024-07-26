import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "~/components/ui/button";

export default function EventLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { projectId: string };
}) {
  return (
    <div className="flex flex-col gap-8 px-4 sm:px-16 lg:px-32 xl:px-64 2xl:px-96 py-4 sm:py-16 border-t">
      <div>
        <Button variant="link" className="text-blue-500" asChild>
          <Link href={`/app/${params.projectId}/events`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Events
          </Link>
        </Button>
      </div>

      {children}
    </div>
  );
}
