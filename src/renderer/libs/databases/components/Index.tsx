import { useDocker } from "../../docker";
import { DatabasesListDatabases } from "./ListDatabases";
import { DatabasesLoadingStatus } from "./LoadingStatus";

export const DatabasesIndex = () => {
  const { isCompleted } = useDocker();

  return (
    <div>
      {isCompleted ? <DatabasesListDatabases /> : <DatabasesLoadingStatus />}
    </div>
  );
};
