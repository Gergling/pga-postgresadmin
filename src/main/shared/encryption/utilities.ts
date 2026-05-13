import z from "zod";
import { safeStorage } from "electron";

export const encrypt = (value?: string): string | undefined => {
  if (!value) return;

  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available');
  }

  const buffer = safeStorage.encryptString(value);
  const base64 = buffer.toString('base64');
  return base64;
};

export const decrypt = (base64: string | null): string | undefined => {
  if (!base64) return;

  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available');
  }

  const buffer = Buffer.from(base64, 'base64');
  return safeStorage.decryptString(buffer);
}

export const decryptTransformer = z.string().nullable().catch(null)
  .transform(decrypt);
export const encryptTransformer = z.string().optional().transform(encrypt);
