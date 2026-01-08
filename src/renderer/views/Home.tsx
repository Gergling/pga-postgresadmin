import { Chip } from "@mui/material";
import { useFirebaseStatus } from "../libs/firebase/hooks";
import { DiaryInterface } from "../features/diary/components";
import { EmailSyncPanel } from "../features/email/components/EmailSyncPanel";

export const HomeView = () => {
  const { isOnline, dbConnected } = useFirebaseStatus();
  return (
    <div>
      <Chip label={`isOnline: ${isOnline}`} />
      <Chip label={`dbConnected: ${dbConnected}`} />
      <EmailSyncPanel />
      <DiaryInterface />
    </div>
  );
};

export default HomeView;
