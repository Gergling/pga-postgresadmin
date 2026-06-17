
// TODO: Needs a utility kit somewhere, probably.
import { readFileContents } from "@/main/shared/file/contents";
import { fileExists } from "@/main/shared/file/exists";

export const extractQualityReportData = async (path: string): Promise<unknown> => {
  try {
    // Check whether the file exists.
    // If not, return an empty object.
    const reportExists = await fileExists(path);
    if (!reportExists) return {};
    // If so, read it and load the contents.
    // JSON parse and return.
    const contents = await readFileContents(path);
    return contents;
  } catch (e) {
    console.error('Error extracting report:', e);
    throw e;
  }
};
