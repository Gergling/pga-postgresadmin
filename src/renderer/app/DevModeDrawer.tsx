// TODO: Library candidate.
import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Collapse,
  ButtonBase,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MetricChip, useTheme } from '@gergling/ui-components';
import { useIpc } from '../shared/ipc';
import { ResponsiveIndicator } from '../shared/common/components/ResponsiveIndicator';

const useEnvironment = () => {
  const { getEnvironment: queryFn, setEnvironment: set } = useIpc();
  const queryClient = useQueryClient();
  const {
    data: environment,
  } = useQuery({
    queryKey: ['environment'],
    queryFn,
  });
  const {
    mutate: setIsProd,
  } = useMutation({
    mutationFn: (isProd: boolean) => set(isProd ? 'prod' : 'dev'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environment']});
      // window.location.reload();
    },
  });

  const isProd = useMemo(() => environment === 'prod', [environment]);

  return {
    isProd,
    setIsProd,
  };
};

const usePersistent = (key: string) => {
  const [item, setItem] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(item));
  }, [item]);

  return {
    item,
    setItem,
  };
};

export const DevModeOverlay = () => {
  const { isProd, setIsProd } = useEnvironment();
  const { item: expanded, setItem: setExpanded } = usePersistent('devModeDrawerExpanded');
  const { item: isFixedPosition, setItem: setFixedPosition } = usePersistent('devModeDrawerFixedPosition');

  const { theme: { colors: { info, warning } } } = useTheme();
  const color = useMemo(() => isProd ? warning.main : info.main, [isProd]);
  const { pathname, search } = useLocation();

  const handleToggleEnv = () => {
    const confirmChange = window.confirm(`Switch to ${!isProd ? 'PRODUCTION' : 'DEVELOPMENT'}? The app will reload.`);
    if (confirmChange) {
      setIsProd(!isProd);
    }
  };

  return (
    <Box sx={{ position: isFixedPosition ? 'fixed' : 'relative', top: 0, left: 0, right: 0, zIndex: expanded ? 1500: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* The Collapsible Content */}
      <Collapse in={expanded} sx={{ width: '100%' }}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 0, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center" flexWrap={'wrap'}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <BuildCircleIcon fontSize="small" /> Dev Engine
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <FormControlLabel
                control={<Switch checked={isProd} onChange={handleToggleEnv} color="warning" sx={{ color }} />}
                label={isProd ? "PRODUCTION DATABASE" : "DEVELOPMENT DATABASE"}
              />
              <FormControlLabel
                control={<Switch checked={isFixedPosition} onChange={(_, checked) => setFixedPosition(checked)} sx={{ color }} />}
                label={"FIXED POSITION"}
              />
            </Grid>

            <Grid container size={{ xs: 12, sm: 6 }} spacing={2}>
              <MetricChip label="Path" value={`${pathname}${search}`} />
              <MetricChip label="Breakpoint" value={<ResponsiveIndicator />} />
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* The "Handle" / Pull-tab */}
      <ButtonBase
        onClick={() => setExpanded(!expanded)}
        sx={{
          height: 24,
          width: 60,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          boxShadow: 2,
          display: 'flex',
          justifyContent: 'center',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        {expanded ? <KeyboardArrowUpIcon htmlColor={color} fontSize="small" /> : <KeyboardArrowDownIcon htmlColor={color} fontSize="small" />}
      </ButtonBase>
    </Box>
  );
};
