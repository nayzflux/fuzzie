import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { accountTable } from "../db/schema";

export const createAccount = async (
  providerUserId: string,
  providerId: "GOOGLE" | "GITHUB",
  userId: string
) => {
  const account = await db
    .insert(accountTable)
    .values({
      providerId,
      providerUserId,
      userId,
    })
    .returning()
    .get();

  console.log(
    `[ACCOUNT] ${account.providerId} - ${account.providerUserId} has been created`
  );

  return account;
};

export const getAccount = async (
  providerUserId: string,
  providerId: "GOOGLE" | "GITHUB"
) =>
  await db.query.accounts.findFirst({
    where: and(
      eq(accountTable.providerUserId, providerUserId),
      eq(accountTable.providerId, providerId)
    ),
  });
