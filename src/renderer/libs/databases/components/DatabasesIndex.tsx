import { useEffect, useMemo } from "react";
import { useDocker } from "../../docker";
import { useDatabasesServerStore } from "../hooks/use-server-store";
import { DatabasesListDatabases } from "./ListDatabases";
import { DatabasesLoadingStatus } from "./LoadingStatus";
import { DatabasesServerConnectionForm } from "./ServerConnectionForm";

const SwitchComponent = ({ show }: { show: string }) => {
  switch (show) {
    case 'server-credentials':
      return <DatabasesServerConnectionForm />;
    case 'databases-list':
      return <DatabasesListDatabases />;
    default:
      return <DatabasesLoadingStatus />;
  }
}

// TODO: We can kick off the checks for docker anyway, but we will need to visualise them differently.
// We don't have any server credentials stored. This will trigger the server connection form to appear.
export const DatabasesIndex = () => {
  const { breakdown, isCompleted } = useDocker();
  const { load, status } = useDatabasesServerStore();
  const show = useMemo(() => {
    // TODO: If the container is missing, the credentials are needed for creation.
    // If it's started, the credentials should only be needed to login.
    if (status === 'empty') return 'server-credentials';
    if (isCompleted) return 'databases-list';
    return 'loading-status';
  }, [isCompleted, status]);

  useEffect(() => {
    // console.log('breakdown', breakdown.exists === 'yes', breakdown)
  }, [breakdown]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    console.log(status)
  }, [status]);

  return (
    <div>
      {status === 'empty' && <div>Please enter your database server connection details.</div>}
      <SwitchComponent show={show} />
      {/* {isCompleted ? <DatabasesListDatabases /> : <DatabasesLoadingStatus />} */}
    </div>
  );
};
