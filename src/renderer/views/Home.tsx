import { Diary } from "../features/diary";
import { EmailSyncPanel } from "../features/email/components/EmailSyncPanel";

export const HomeView = () => {
  return (
    <div>
      <EmailSyncPanel />
      <Diary />
    </div>
  );
};

export default HomeView;
