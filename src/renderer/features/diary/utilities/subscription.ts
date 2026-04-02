import { getIpc } from "../../../shared/ipc/util";

export const subscribe = <T extends object>(set: (state: Partial<T>) => void) => {
  const { subscribeToRitualTelemetry } = getIpc();
  const removeListener = subscribeToRitualTelemetry(({
    message,
    timestamp,
    triage,
    votes,
  }) => { 
    console.log('subbed', message, timestamp, triage, votes) 
    // set({ checklist, isCompleted, needsServerCredentials });
  
    // if (isDone) {
    //   removeListener();
    // }
  });
}
