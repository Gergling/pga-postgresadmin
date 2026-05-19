import { Stack } from "@mui/material";
import { Accordion } from "@/renderer/shared/accordion";
import { SettingsForm } from "./Form";
import { trpcReact } from "@/renderer/libs/react-query";
import { useMemo } from "react";
import { ProgressBar } from "@/renderer/shared/progress-bar";

export const SettingsRoot = () => {
  const {
    data: allSettings, isLoading
  } = trpcReact.settings.fetchApp.useQuery();

  const showState = useMemo(() => {
    if (isLoading) return 'loading';
    if (allSettings) return 'data';
    return 'error';
  }, [allSettings, isLoading]);

  return <Stack spacing={2} sx={{ p: 2 }}>
    <SettingsForm />
    <Accordion summary="Data">
      {showState === 'loading' && <ProgressBar />}
      {showState === 'data' && <pre>{JSON.stringify(allSettings, null, 2)}</pre>}
      {showState === 'error' && 'An error occurred'}
    </Accordion>
  </Stack>;
};
