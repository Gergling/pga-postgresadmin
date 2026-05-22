import { PropsWithChildren } from "react";
import { ReleaseUpdateSubscriptionParameters } from "@/shared/features/release";
import { trpcReact } from "@/renderer/libs/react-query";
import { Button } from "@/renderer/shared/form";
import { Grid } from "@mui/material";
import { ProgressBar } from "@/renderer/shared/progress-bar";

const ActionButton = (
  { children, isPending, mutate }: PropsWithChildren & {
    isPending: boolean; mutate: () => void;
  }
) => <Button 
  disabled={isPending}
  onClick={() => mutate()}
>
  {children}
</Button>;

const CheckForUpdates = () => {
  const checkMutation = trpcReact.release.checkForUpdates.useMutation();
  return <ActionButton {...checkMutation}>
    {checkMutation.isPending ? 'Checking...' : 'Check for Updates'}
  </ActionButton>;
}

const DownloadUpdate = () => {
  const downloadMutation = trpcReact.release.downloadUpdate.useMutation();
  return <ActionButton {...downloadMutation}>
    Download Update Now
  </ActionButton>;
}

const InstallUpdate = () => {
  const installMutation = trpcReact.release.quitAndInstall.useMutation();
  return <ActionButton {...installMutation}>
    Restart and Install
  </ActionButton>;
};


export const ReleaseUpdateInterface = (
  { message, progress, status }: ReleaseUpdateSubscriptionParameters
) => <Grid container spacing={2}>
  <Grid><h3>System Updates</h3></Grid>
  <Grid><p>{message}</p></Grid>

  <Grid size={4}>
    {status === 'idle' && <CheckForUpdates />}

    {status === 'update-available' && <DownloadUpdate />}

    {status === 'download-progress' && (
      <div>
        <ProgressBar value={progress === undefined ? undefined : progress / 100} />
      </div>
    )}

    {status === 'update-downloaded' && <InstallUpdate />}
  </Grid>
</Grid>;
