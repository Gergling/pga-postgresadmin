import { access } from "node:fs";
import { promisify } from "node:util";

const accessAsync = promisify(access);

export const fileExists = async (path: string) => {
  try {
    await accessAsync(path);
    return true;
  } catch {
    return false;
  }
};
