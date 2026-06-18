import { FileUnitTestOperation } from "@/shared/features/explorer";

export const analyseSourceFileName = (name: string) => {
  const isTsSourceFile = name.endsWith('.ts');
  const isTsTestFile = name.endsWith('.test.ts');
  const testFileName = isTsSourceFile && !isTsTestFile
    ? name.replace('.ts', '.test.ts')
    : undefined
  ;
  return {
    isTsSourceFile,
    isTsTestFile,
    testFileName
  };
};

export const isTestableFile = (
  isSource: boolean, hasTest: boolean
): FileUnitTestOperation => {
  if (!isSource) return 'none';
  if (hasTest) return 'update';
  return 'create';
}
