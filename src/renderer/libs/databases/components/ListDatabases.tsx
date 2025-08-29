import { useEffect } from 'react';
import { useIpc } from '../../../shared/ipc/hook';
import { Table } from "../../../shared/table/Table";
import { useDatabasesStore } from '../use-databases-store';

export const DatabasesListDatabases = () => {
  const { selectDatabases } = useIpc();
  const { databases, error, fetch, loading } = useDatabasesStore();

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
