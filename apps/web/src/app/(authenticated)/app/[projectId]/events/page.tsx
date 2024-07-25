"use client";

import { useParams } from "next/navigation";
import { useProjectEvents } from "~/hooks/use-projects-events";
import EventsTable from "./events-table";

export default function EventsPage() {
  const { projectId } = useParams() as { projectId: string };
  const { data: events, isPending, isError } = useProjectEvents(projectId);

  if (isError) {
    return <p>Error!</p>;
  }

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <EventsTable events={events} />
    </div>
  );
}
