export type Project = {
  id: string;
  name: string;
  createdAt: string;
  userId: string;
};

export type PartialProject = Omit<Project, "userId">;
