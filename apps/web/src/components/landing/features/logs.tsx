import RequestsTable from "~/app/(authenticated)/app/(event)/[projectId]/events/[eventId]/webhook-requests-table";
import { WebhookRequest } from "~/types/webhook-request";
import { FeatureBackgrond } from "./feature-background";

const requests: WebhookRequest[] = [
  {
    id: "wh_req_2",
    status: "SUCCEEDED",
    responseCode: 200,
    sentAt: new Date().toISOString(),
    scheduledFor: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    eventId: "",
  },
  {
    id: "wh_req_1",
    status: "FAILED",
    responseCode: 500,
    sentAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    scheduledFor: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    eventId: "",
  },
  {
    id: "wh_req_1",
    status: "FAILED",
    responseCode: 500,
    sentAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    scheduledFor: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    eventId: "",
  },
  {
    id: "wh_req_1",
    status: "FAILED",
    responseCode: 500,
    sentAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    scheduledFor: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    eventId: "",
  },
  {
    id: "wh_req_1",
    status: "FAILED",
    responseCode: 500,
    sentAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    scheduledFor: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    eventId: "",
  },
  {
    id: "wh_req_1",
    status: "FAILED",
    responseCode: 500,
    sentAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    scheduledFor: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    eventId: "",
  },
];

export const Logs = () => {
  return (
    <FeatureBackgrond>
      <RequestsTable events={requests} />
    </FeatureBackgrond>
  );
};
