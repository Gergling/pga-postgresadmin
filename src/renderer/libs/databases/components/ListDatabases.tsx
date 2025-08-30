import { useEffect, useState } from 'react';
import { Table } from "../../../shared/table/Table";
import { useDatabasesStore } from '../use-databases-store';
import { Button } from '@mui/material';
import { CreateDatabaseModal } from './CreateDatabase';

export const DatabasesListDatabases = () => {
  const { create, databases, error, fetch, loading } = useDatabasesStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleHideCreateModal = () => setShowCreateModal(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  useEffect(() => {
    if (fetch) {
      fetch();
    }
  }, [fetch]);

  return (
    <div>
      <h1>Databases</h1>
      <Button onClick={handleShowCreateModal}>Create New Database</Button>
      <CreateDatabaseModal
        open={showCreateModal}
        onClose={handleHideCreateModal}
        onConfirm={create}
      />
      <Table rows={databases} />
    </div>
  );
};
