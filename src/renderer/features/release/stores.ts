import { create } from "zustand";
import { ReleaseUpdateSubscriptionParameters } from "@/shared/features/release";

const reduce = ({
  message, progress, status,
}: ReleaseUpdateSubscriptionParameters): ReleaseUpdateSubscriptionParameters => {
  switch(status) {
    case 'checking-for-update': return {
      status, message: 'Checking for updates...'
    };
    case 'update-available': return {
      status, message: 'A new stable release is available!'
    };
    case 'update-not-available': return {
      status, message: 'You are running the newest version.'
    };
    case 'error': return { status, message };
    case 'download-progress': return {
      status, message: 'Downloading update...', progress
    };
    case 'update-downloaded': return {
      status, message: 'Update downloaded successfully!'
    };
    default: return { status: 'idle', message: `Updater ${status}` };
  }
}

export const releaseUpdaterStore = create<ReleaseUpdateSubscriptionParameters & {
  update: (props: ReleaseUpdateSubscriptionParameters) => void;
}>((set) => ({
  status: 'idle',
  progress: undefined,
  message: undefined,
  update: (props: ReleaseUpdateSubscriptionParameters) => set(reduce(props)),
}));