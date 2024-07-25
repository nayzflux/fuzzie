export type EventStatus =
  | "TRIGGERED"
  | "REPLAYED"
  | "DELIVERED"
  | "NOT_DELIVERED";

export type Event = {
  id: string;
  name: string;
  status: EventStatus;
  webhookUrl: string;
  data: Record<string, unknown>;
  createdAt: string;
  projectId: string;
};

export type PartialEvent = Omit<Event, "data">;
