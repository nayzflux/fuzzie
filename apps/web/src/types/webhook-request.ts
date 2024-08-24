export type WebhookRequest = PartialWebhookRequest & {
  requestHeaders?: string;
  requestBody?: string;
  requestUrl?: string;

  responseHeaders?: string;
  responseBody?: string;
  responseCode?: number;
};

export type PartialWebhookRequest = {
  id: string;

  status: "SCHEDULED" | "SUCCEEDED" | "FAILED";

  scheduledFor: string;
  sentAt?: string;
  createdAt: string;

  eventId: string;
};
