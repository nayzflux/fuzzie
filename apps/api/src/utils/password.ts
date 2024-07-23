export const createHash = async (password: string) =>
  await Bun.password.hash(password, "argon2id");

export const verify = async (password: string, hash: string) =>
  await Bun.password.verify(password, hash, "argon2id");
