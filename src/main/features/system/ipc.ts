import { observable } from '@trpc/server/observable';
import { FirebaseDatabaseStatus } from '@/shared/lib/firebase';
import { tRPC } from "@/main/config";
import {
  getDatabaseStatus,
  getFirebaseDb
} from "@/main/libs/firebase";
import { checkResources } from "./crud";
import { CheckResourceResponse } from "./types";

export const systemRouter = tRPC.router({
  checkDatabaseStatus: tRPC.procedure.subscription(
    () => observable<FirebaseDatabaseStatus>((emit) => {
      const emitDatabaseStatus = async () => {
        const db = await getFirebaseDb(true);
        const status = getDatabaseStatus(db);
        emit.next(status);
      };
      const timer = setInterval(emitDatabaseStatus, 5000);

      emitDatabaseStatus();

      return () => {
        clearInterval(timer);
      };
    })
  ),
  checkResourceSubscription: tRPC.procedure.subscription(
    () => observable<CheckResourceResponse>((emit) => {
      const emitResources = async () => {
        const resources = await checkResources();
        emit.next(resources);
      }
      const timer = setInterval(emitResources, 5000);

      emitResources();

      return () => {
        clearInterval(timer);
      };
    }),
  ),
});
