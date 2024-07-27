import { CryptoHasher } from "bun";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { apiKeyTable } from "~/db/schema";
import { nanoid, newId } from "~/lib/nanoid";

export const createApiKey = async (name: string, projectId: string) => {
  const key = "fu_" + nanoid(32);
  const hash = CryptoHasher.hash("sha256", key, "base64");

  const apiKey = await db
    .insert(apiKeyTable)
    .values({
      id: newId("key"),
      name,
      key: hash,
      createdAt: new Date(),
      projectId,
    })
    .returning({
      id: apiKeyTable.id,
      name: apiKeyTable.name,
      createdAt: apiKeyTable.createdAt,
      projectId: apiKeyTable.projectId,
    })
    .get();

  return { key, ...apiKey };
};

export const getApiKeyWithProject = async (key: string) => {
  const hash = CryptoHasher.hash("sha256", key, "base64");

  const apiKey = await db.query.apiKeys.findFirst({
    where: eq(apiKeyTable.key, hash),
    columns: {
      key: false,
    },
    with: {
      project: true,
    },
  });

  return apiKey;
};

export const getApiKeyWithProjectById = async (id: string) => {
  const apiKey = await db.query.apiKeys.findFirst({
    where: eq(apiKeyTable.id, id),
    columns: {
      key: false,
    },
    with: {
      project: true,
    },
  });

  return apiKey;
};

export const deleteApiKey = async (id: string) => {
  await db.delete(apiKeyTable).where(eq(apiKeyTable.id, id));
};
