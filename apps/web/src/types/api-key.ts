export type ApiKey = {
  id: string;
  name: string;
  createdAt: string;
  projectId: string;
};

export type CreatedApiKey = ApiKey & {
  key: string;
};
