import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { userTable } from "~/db/schema";
import { newId } from "~/lib/nanoid";
import { createHash } from "~/utils/password";

export const createUser = async (email: string, password: string) => {
  // Generate user id
  const id = newId("u");
  // Hash password
  const hash = await createHash(password);
  // Get current date
  const createdAt = new Date();

  const user = await db
    .insert(userTable)
    .values({
      id,
      email,
      password: hash,
      createdAt,
    })
    .returning({
      id: userTable.id,
      email: userTable.email,
      isEmailVerified: userTable.isEmailVerified,
      createdAt: userTable.createdAt,
    })
    .get();

  console.log(`[USER] ${email} has been created`);

  return user;
};

export const createUserWithoutPassword = async (email: string) => {
  // Generate user id
  const id = newId("u");
  // Get current date
  const createdAt = new Date();

  const user = await db
    .insert(userTable)
    .values({
      id,
      email,
      isEmailVerified: true,
      createdAt,
    })
    .returning({
      id: userTable.id,
      email: userTable.email,
      isEmailVerified: userTable.isEmailVerified,
      createdAt: userTable.createdAt,
    })
    .get();

  console.log(`[USER] ${email} has been created`);

  return user;
};

export const getUserWithPassword = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(userTable.email, email),
  });
};

export const getUser = async (id: string) => {
  return await db.query.users.findFirst({
    where: eq(userTable.email, id),
    columns: {
      password: false,
    },
  });
};

export const setUserEmailVerification = async (
  id: string,
  email: string,
  isEmailVerified: boolean
) => {
  return await db
    .update(userTable)
    .set({
      isEmailVerified,
    })
    .where(and(eq(userTable.id, id), eq(userTable.email, email)));
};
