import { tRPC } from "@/main/config";
import {
  getDatabaseStatus,
  getFirebaseDb
} from "@/main/libs/firebase";
import { systemCheck } from "./crud";
import { getSystemNetworkSnapshot } from "./etl";

export const systemRouter = tRPC.router({
  check: tRPC.procedure.query(async () => {
    const firestoreDb = getFirebaseDb(true);
    const db = getDatabaseStatus(firestoreDb);
    const network = getSystemNetworkSnapshot();
    const resources = systemCheck();
    return {
      db,
      network,
      resources,
    };
  }),
});
