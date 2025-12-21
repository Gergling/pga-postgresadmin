import { useEffect, useState } from 'react';
import { KeyboardArrowRight } from '@mui/icons-material';
import { Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useDatabasesStore } from '../use-databases-store';
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
  // TODO: Hook the routing for the databases section.

  return (
    <div>
      <h1>Databases</h1>
      <Button onClick={handleShowCreateModal}>Create New Database</Button>
      <CreateDatabaseModal
        open={showCreateModal}
        onClose={handleHideCreateModal}
        onConfirm={create}
      />
      <List dense={true}>
        {databases.map(({ datname }) => 
          <ListItem key={datname}>
            <ListItemButton href={`/databases/${datname}`}>
              <ListItemText primary={datname}/>
              <ListItemIcon>
                <KeyboardArrowRight />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </div>
  );
};
