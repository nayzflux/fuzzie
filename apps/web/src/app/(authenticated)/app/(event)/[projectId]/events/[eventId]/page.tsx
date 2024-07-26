"use client";

import { useParams } from "next/navigation";
import EventStatusBadge from "~/app/(authenticated)/app/[projectId]/events/event-status-badge";
import CodeBlock from "~/components/code-block";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useEvent } from "~/hooks/use-event";
import { formatDateTimeLong } from "~/lib/format";
import ReplayEventDialog from "./replay-event-dialog";
import WebhookRequestsWrapper from "./webhook-requests-wrapper";

export default function EventPage() {
  const { eventId, projectId } = useParams() as {
    eventId: string;
    projectId: string;
  };
  const { data: event, isPending } = useEvent(eventId);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        {/* Event name */}
        {isPending ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          <p className="text-xl font-semibold">{event?.name}</p>
        )}

        <div className="flex items-center gap-4">
          <ReplayEventDialog />
        </div>
      </div>

      <Separator />

      {/* Data card */}
      <div className="grid grid-cols-3 gap-4">
        {/* Create At */}
        <Card className="flex flex-col gap-2 p-4">
          <p>Created At</p>

          {isPending ? (
            <Skeleton className="h-[25px] w-40" />
          ) : (
            <p>{formatDateTimeLong(event?.createdAt || "")}</p>
          )}
        </Card>

        {/* Destination URL */}
        <Card className="flex flex-col gap-2 p-4">
          <p>Destination URL</p>

          {isPending ? (
            <Skeleton className="h-[25px] w-40" />
          ) : (
            <div>
              <Badge variant="secondary">{event?.webhookUrl}</Badge>
            </div>
          )}
        </Card>

        {/* Status */}
        <Card className="flex flex-col gap-2 p-4">
          <p>Status</p>

          {isPending ? (
            <Skeleton className="h-[25px] w-40" />
          ) : (
            <div>
              <EventStatusBadge status={event?.status || "DELIVERED"} />
            </div>
          )}
        </Card>
      </div>

      {/* Event data */}
      <div>
        <p className="text-xl font-semibold">Event Data</p>
      </div>

      <Separator />

      {isPending ? (
        <Skeleton className="w-full h-[400px]" />
      ) : (
        <CodeBlock code={event?.data} />
      )}

      {/* Webhook request */}
      <div>
        <p className="text-xl font-semibold">Webhook requests</p>
      </div>

      <Separator />

      <WebhookRequestsWrapper />
    </div>
  );
}
