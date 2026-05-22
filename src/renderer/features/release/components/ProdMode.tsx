import { trpcReact } from "@/renderer/libs/react-query";
import { releaseUpdaterStore } from "../stores";
import { ReleaseUpdateInterface } from "./UpdateInterface";

export const ReleaseProdMode: React.FC = () => {
  const {
    message, progress, status, update,
  } = releaseUpdaterStore();

  trpcReact.release.onUpdateStatus.useSubscription(undefined, { onData: update });

  return <ReleaseUpdateInterface
    message={message} progress={progress} status={status}
  />;
};
