import { enGB } from 'date-fns/locale';
import { PropsWithChildren } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
// If you are using date-fns v3.x or v4.x, please import `AdapterDateFns`
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// If you are using date-fns v2.x, please import the v2 adapter
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';

export const AppLocalisationProvider = (
  { children }: PropsWithChildren
) => <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
  {children}
</LocalizationProvider>;
