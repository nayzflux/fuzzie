import { useParams } from "next/navigation";
import { useEventWebhookRequests } from "~/hooks/use-event-wehook-requests";
import RequestsTable from "./webhook-requests-table";

export default function WebhookRequestsWrapper() {
  const { eventId } = useParams() as { eventId: string };
  const { data: webhookRequests, isPending } = useEventWebhookRequests(eventId);

  if (isPending) {
    return <p>Loading...</p>;
  }

  return <RequestsTable events={webhookRequests || []} />;
}
