import { tRPC } from "@/main/config";
import {
  getDatabaseStatus,
  getFirebaseDb
} from "@/main/libs/firebase";
import { systemCheck } from "./crud";

export const systemRouter = tRPC.router({
  check: tRPC.procedure.query(async () => {
    const firestoreDb = getFirebaseDb(true);
    const db = getDatabaseStatus(firestoreDb);
    return {
      db,
      resources: systemCheck(),
    };
  }),
});
