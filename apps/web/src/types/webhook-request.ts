export type WebhookRequest = PartialWebhookRequest & {
  requestHeaders: string;
  requestBody: string;
  requestUrl: string;

  responseHeaders: string;
  responseBody: string;
  responseCode: string;
};

export type PartialWebhookRequest = {
  id: string;

  status: "SCHEDULED" | "SUCCEEDED" | "FAILED";

  sentAt: string | null;
  createdAt: string;

  eventId: string;
};
