export type InternalEventType =
  | "webhook_request.succeeded"
  | "webhook_request.failed";

export type InternalEvent = {
  event: InternalEventType;
  data: Record<string, unknown>;
  sentAt: string | Date;
};

export type InternalWebhookRequestEvent = InternalEvent & {
  data: InternalWebhookRequestEventData;
};

export type InternalWebhookRequestEventData = {
  id: string;
  eventId: string;
  sentAt: string | Date;

  requestUrl?: string;
  requestBody?: unknown;
  requestHeaders?: Record<string, string>;

  responseBody?: unknown;
  responseCode?: number;
  responseHeaders?: Record<string, string>;

  retry: number;
};
