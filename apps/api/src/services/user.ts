import { and, eq } from "drizzle-orm";
import { db } from "~/db";
import { userTable, type User } from "~/db/schema";
import { newId } from "~/lib/nanoid";
import { stripe } from "~/lib/stripe";
import { createHash } from "~/utils/password";

export const createUser = async (email: string, password: string) => {
  // Generate user id
  const id = newId("u");
  // Hash password
  const hash = await createHash(password);
  // Get current date
  const createdAt = new Date();

  /**
   * Create stripe customer
   */
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId: id,
    },
  });

  const user = await db
    .insert(userTable)
    .values({
      id,
      email,
      password: hash,
      createdAt,
      stripeCustomerId: customer.id,
    })
    .returning({
      id: userTable.id,
      email: userTable.email,
      isEmailVerified: userTable.isEmailVerified,
      createdAt: userTable.createdAt,
      plan: userTable.plan,
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

  /**
   * Create stripe customer
   */
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId: id,
    },
  });

  const user = await db
    .insert(userTable)
    .values({
      id,
      email,
      isEmailVerified: true,
      createdAt,
      stripeCustomerId: customer.id,
    })
    .returning({
      id: userTable.id,
      email: userTable.email,
      isEmailVerified: userTable.isEmailVerified,
      createdAt: userTable.createdAt,
      plan: userTable.plan,
    })
    .get();

  console.log(`[USER] ${email} has been created`);

  return user;
};

export const getUserWithPassword = async (email: string) => {
  return await db.query.users.findFirst({
    where: eq(userTable.email, email),
    columns: {
      stripeCustomerId: false,
      stripeSubscriptionId: false,
    },
  });
};

export const getUser = async (id: string) => {
  return await db.query.users.findFirst({
    where: eq(userTable.id, id),
    columns: {
      password: false,
      stripeCustomerId: false,
      stripeSubscriptionId: false,
    },
  });
};
export const getUserWithStripeInfo = async (id: string) => {
  return await db.query.users.findFirst({
    where: eq(userTable.id, id),
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
    .where(and(eq(userTable.id, id), eq(userTable.email, email)))
    .returning({
      id: userTable.id,
      email: userTable.email,
      isEmailVerified: userTable.isEmailVerified,
      createdAt: userTable.createdAt,
      plan: userTable.plan,
    })
    .get();
};

export const updateUser = async (userId: string, values: Partial<User>) => {
  const user = await db
    .update(userTable)
    .set(values)
    .where(eq(userTable.id, userId))
    .returning({
      id: userTable.id,
      email: userTable.email,
      isEmailVerified: userTable.isEmailVerified,
      createdAt: userTable.createdAt,
      plan: userTable.plan,
    })
    .get();

  return user;
};

export const updateUserBySubscriptionId = async (
  subscriptionId: string,
  values: Partial<User>
) => {
  const user = await db
    .update(userTable)
    .set(values)
    .where(eq(userTable.stripeSubscriptionId, subscriptionId))
    .returning({
      id: userTable.id,
      email: userTable.email,
      isEmailVerified: userTable.isEmailVerified,
      createdAt: userTable.createdAt,
      plan: userTable.plan,
    })
    .get();

  return user;
};

export const deleteUser = async (userId: string) => {
  const user = await db
    .delete(userTable)
    .where(eq(userTable.id, userId))
    .returning({
      id: userTable.id,
      email: userTable.email,
      isEmailVerified: userTable.isEmailVerified,
      createdAt: userTable.createdAt,
      plan: userTable.plan,
    })
    .get();

  return user;
};
