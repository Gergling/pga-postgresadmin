import path from "path";

export const resolveAbsolutePath = (val: string) => {
  const filePath = path.normalize(val);

  if (filePath.startsWith('\\') && !filePath.toLowerCase().startsWith('c:')) {
    return path.resolve('C:', filePath);
  }

  return path.resolve(filePath);
};
