import React from 'react';
import { Grid } from '@mui/material';
import { trpcReact } from '@/renderer/libs/react-query';
import { ReleaseProdMode } from './ProdMode';
import { ReleaseDevMode } from './DevMode';

export const ReleaseUpdate: React.FC = () => {
  const { data: isDevEnabled } = trpcReact.environments.devEnabled.useQuery();

  return (
    <Grid container spacing={2}>
      {isDevEnabled ? <ReleaseDevMode /> : <ReleaseProdMode />}
    </Grid>
  );
};
