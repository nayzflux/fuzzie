const MAX_PRO_EVENT = 5000;
const MAX_PRO_REQUEST = 30000;
const MAX_PRO_ANALYTICS = 90 * 24 * 60 * 60 * 1000;

const MAX_FREE_EVENT = 500;
const MAX_FREE_REQUEST = 2000;
const MAX_FREE_ANALYTICS = 7 * 24 * 60 * 60 * 1000;

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

export const isAnalyticsPeriodExceeded = (
  user: {
    plan: "FREE" | "PRO";
    eventUsageCount: number;
    webhookRequestUsageCount: number;
  },
  start: number,
  end: number
) => {
  switch (user.plan) {
    case "FREE":
      return end - start > MAX_FREE_ANALYTICS;
    case "PRO":
      return end - start > MAX_PRO_ANALYTICS;
  }
};
