import z from "zod";
import { safeStorage } from "electron";

export const secureCodec = z.codec(
  z.string(), // Input: A string such as an API key.
  z.string(), // Output: An encrypted string.
  {
    decode: (plain) => encrypt(plain),
    encode: (encrypted) => decrypt(encrypted),
  }
);

export const encrypt = (value: string): string => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available');
  }

  const buffer = safeStorage.encryptString(value);
  const base64 = buffer.toString('base64');
  return base64;
};

export const decrypt = (base64: string): string => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available');
  }

  const buffer = Buffer.from(base64, 'base64');
  return safeStorage.decryptString(buffer);
}
