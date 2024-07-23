import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  12
);

export const newId = (prefix: "u" | "p" | "e" | "wh_req" | string) => {
  const id = nanoid();
  return [prefix, id].join("_");
};
