const MAX_PRO_EVENT = 5000;
const MAX_PRO_REQUEST = 30000;

const MAX_FREE_EVENT = 500;
const MAX_FREE_REQUEST = 2000;

export const isEventExceeded = (user: {
  plan: "FREE" | "PRO";
  eventUsageCount: number;
  webhookRequestUsageCount: number;
}) => {
  switch (user.plan) {
    case "FREE":
      return user.eventUsageCount >= MAX_FREE_EVENT;
    case "PRO":
      return user.eventUsageCount >= MAX_PRO_EVENT;
  }
};

export const isWebhookRequestExceeded = (user: {
  plan: "FREE" | "PRO";
  eventUsageCount: number;
  webhookRequestUsageCount: number;
}) => {
  switch (user.plan) {
    case "FREE":
      return user.eventUsageCount >= MAX_FREE_REQUEST;
    case "PRO":
      return user.eventUsageCount >= MAX_PRO_REQUEST;
  }
};