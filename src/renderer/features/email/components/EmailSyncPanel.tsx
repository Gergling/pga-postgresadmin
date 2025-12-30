import { useState } from 'react';
import styled from '@emotion/styled';
import { useIpc } from '../../../shared/ipc/hook';
// reuse your Firestore listener logic from the Diary component

const SyncButton = styled.button`
  background: ${props => props.disabled ? '#444' : '#c53030'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover { background: #a52828; }
`;

export const EmailSyncPanel = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { triageEmailTasks } = useIpc();

  const handleSync = async () => {
    setIsSyncing(true);
    // This calls the IPC bridge we will define in preload.ts
    console.log('about to sync')
    const result = await triageEmailTasks();
    setIsSyncing(false);
    console.log('synced?', result);
  };

  return (
    <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Inbox Fragments</h3>
        <SyncButton onClick={handleSync} disabled={isSyncing}>
          {isSyncing ? 'Syncing...' : 'Sync Recent Emails'}
        </SyncButton>
      </div>
      {/* List logic here similar to your DiaryEntry list */}
    </div>
  );
};
