import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export function encrypt(text: string, key: string) {
  // Generate IV
  const iv = randomBytes(12);

  // Encrypt
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  let cipherText = cipher.update(text, "utf-8");
  cipherText = Buffer.concat([cipherText, cipher.final()]);

  // Get Auth Tag
  const authTag = cipher.getAuthTag();

  // Concat and Encode in base64
  const encryptedData = Buffer.concat([iv, authTag, cipherText]).toString(
    "base64"
  );

  return encryptedData;
}

export function decrypt(text: string, key: string) {
  // Decode base64
  const data = Buffer.from(text, "base64");

  // Extract IV, Auth Tag, and Cipher Text
  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const cipherText = data.subarray(28);

  // Decrypt
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  let decryptedText = decipher.update(cipherText).toString();
  decryptedText += decipher.final("utf-8");

  return decryptedText;
}