import { transformTemplateCompilation } from '@/shared/utilities';
import { join } from 'node:path';

/**
 * Mostly a convenience to avoid mucking about with file handling.
 * @param dirPath The directory path for the markdown file.
 * @param markdownFileName The name of the markdown file. Don't include the
 * '.md' extension.
 */
export const getMainPromptFactory = <
  T extends string,
>(dirPath: string, markdownFileName: string) => {
  const template = join(dirPath, markdownFileName, '.md');
  return (variables: Record<T, string>) => transformTemplateCompilation<T>(
    template, variables
  );
};
