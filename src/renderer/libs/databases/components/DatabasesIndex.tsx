import { useEffect, useMemo } from "react";
import { useDockerStore } from "../../docker";
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

export const DatabasesIndex = () => {
  const {
    isCompleted,
    needsServerCredentials,
  } = useDockerStore();
  const { load, status } = useDatabasesServerStore();
  const show = useMemo(() => {
    if (status === 'empty' || needsServerCredentials) return 'server-credentials';
    if (isCompleted) return 'databases-list';
    return 'loading-status';
  }, [isCompleted, needsServerCredentials, status]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      {status === 'empty' && <div>Please enter your database server connection details.</div>}
      <SwitchComponent show={show} />
    </div>
  );
};
