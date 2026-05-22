import { useState } from "react";
import { ReleaseUpdateSubscriptionParameters } from "@/shared/features/release";
import { Dropdown } from "@/renderer/shared/common";
import { releaseUpdaterStore } from "../stores";
import { ReleaseUpdateInterface } from "./UpdateInterface";
import { Grid, Stack } from "@mui/material";

type Event = ReleaseUpdateSubscriptionParameters & {
  label: string; value: string;
};

const events: Event[] = [
  { status: 'idle' },
  { status: 'checking-for-update' },
  { status: 'update-available' },
  { status: 'update-not-available' },
  { status: 'update-downloaded' },
  { status: 'error', message: 'An error message will be displayed here.' },
  { status: 'download-progress' },
  { status: 'download-progress', progress: 0 },
  { status: 'download-progress', progress: 1 },
  { status: 'download-progress', progress: 49 },
  { status: 'download-progress', progress: 50 },
  { status: 'download-progress', progress: 51 },
  { status: 'download-progress', progress: 99 },
  { status: 'download-progress', progress: 100 },
].map(({ status, progress, ...props }) => {
  const label = (
    progress !== undefined ? `download: ${progress}%` : status
  ).toUpperCase();
  return {
    ...props, status: status as ReleaseUpdateSubscriptionParameters['status'],
    label, value: [status, label ?? ''].join(':'), progress,
  };
});

const eventsMap = new Map(events.map((props) => [props.value, props]));

export const ReleaseDevMode = () => {
  const {
    message, progress, status, update,
  } = releaseUpdaterStore();
  const [selected, setSelected] = useState(events[0].value);
  const handleSelect = (value: string) => {
    const event = eventsMap.get(value);
    if (!event) return;
    setSelected(value);
    update(event);
  }
  return <Stack spacing={2}>
    <ReleaseUpdateInterface
      message={message}
      progress={progress}
      status={status}
    />
    <Grid container spacing={2}>
      Dev Mode Control:
      <Dropdown
        icon={<></>}
        onSelect={handleSelect}
        options={events}
        selected={selected}
        showSelectedText
      />
    </Grid>
  </Stack>;
};
