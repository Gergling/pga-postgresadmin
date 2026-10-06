import { tRPC } from "@/main/config";
import {
  getDatabaseStatus,
  getFirebaseDb
} from "@/main/libs/firebase";
import { systemCheck } from "./crud";
import { getSystemNetworkSnapshot } from "./etl";
import { observable } from "@trpc/server/observable";
import { schedulerState } from "./scheduler";
import {
  SchedulerStateManagerSubscriberParams
} from "@/shared/features/system";

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
  telemetry: tRPC.procedure
    .subscription(
      () => observable<
        SchedulerStateManagerSubscriberParams<'finish' | 'queue' | 'start'>, unknown
      >((emit) => schedulerState.subscribe((params) => emit.next(params)))
    ),
});
