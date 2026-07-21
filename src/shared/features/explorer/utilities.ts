import path from "path";

/**
 * @todo Move to @/main/shared and deprecate this.
 * @param val 
 * @returns 
 */
export const resolveAbsolutePath = (val: string) => {
  const filePath = path.normalize(val);

  if (filePath.startsWith('\\') && !filePath.toLowerCase().startsWith('c:')) {
    return path.resolve('C:', filePath);
  }

  return path.resolve(filePath);
};
