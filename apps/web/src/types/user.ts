export type CurrentUser = {
  id: string;
  isEmailVerified: boolean;
  email: string;
  createdAt: Date;
  plan: "FREE" | "PRO";
  eventUsageCount: number;
  webhookRequestUsageCount: number;
};
