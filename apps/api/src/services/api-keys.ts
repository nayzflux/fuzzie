import { CryptoHasher } from "bun";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { apiKeyTable } from "~/db/schema";

export const getApiKeyWithProject = async (key: string) => {
  const hash = CryptoHasher.hash("sha256", key, "base64");
  
  const apiKey = await db.query.apiKeys.findFirst({
    where: eq(apiKeyTable.key, hash),
    with: {
      project: true,
    },
  });

  return apiKey;
}
