import {
  ExplorerFileRecordProps
} from "@/shared/features/explorer";
import { setupBasicNeDb } from "@/main/libs/nedb";

export const explorerFileRecords = setupBasicNeDb<ExplorerFileRecordProps>(
  'explorer'
);

// TODO: Should use the path generated from the class constructor to create
// this unique key index. This will deprecate the "path" in the class.
// The zod template needs an update first. That's an opportunity to move the
// path resolution function to main/shared, which is where it should always
// have been.
// db.ensureIndex({ fieldName: 'combinedKey', unique: true }, function (err) {
//   if (err) console.log("Index error");
// });

explorerFileRecords.db.setAutocompactionInterval(1000 * 60 * 60 * 12);
