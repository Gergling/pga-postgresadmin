import { LogApi } from "@/main/shared";
import { readAllExplorerRecords } from "../crud";
import { transformSnapshot } from "../transformers";

// WHy is this here? This should be in crud, right? No?
export const extractStatusSnapshot = async (logApi: LogApi) => {
  const records = await readAllExplorerRecords(logApi);
  return transformSnapshot(records);
};
