import { useEffect } from "react";
import { useDatabases } from "../libs/databases/use-databases-store";
import { useIpc } from '../shared/ipc/hook';
import { Table } from "../shared/table/Table";


export const DatabasesView = () => {
  const { selectDatabases } = useIpc();
  const { databases, error, fetch, loading } = useDatabases();

  useEffect(() => {
    if (fetch && selectDatabases) {
      fetch(selectDatabases);
    }
  }, [fetch, selectDatabases]);

  return (
    <div>
      <h1>Databases</h1>
      <div>Error: {error}</div>
      <div>Loading: {loading}</div>
      <Table rows={databases} />
    </div>
  );
};
