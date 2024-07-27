export type CurrentUser = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  plan: "PRO" | "FREE";
  createdAt: string;
};
