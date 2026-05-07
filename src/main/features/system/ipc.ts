import { tRPC } from "@/main/config";
import {
  getDatabaseStatus,
  getFirebaseDb
} from "@/main/libs/firebase";
import { checkResources } from "./crud";

export const systemRouter = tRPC.router({
  check: tRPC.procedure.query(async () => {
    const firestoreDb = await getFirebaseDb(true);
    const db = getDatabaseStatus(firestoreDb);
    return {
      db,
      resources: await checkResources(),
    };
  }),
});
