// TODO: Library candidate.
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Collapse,
  ButtonBase,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Stack
} from '@mui/material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Layers, Start } from '@mui/icons-material';
import { MetricChip, useTheme } from '@gergling/ui-components';
import {
  ResponsiveIndicator
} from '../shared/common';
import { trpcReact } from '../libs/react-query';

type RunMode = 'dev' | 'preview' | 'prod';

/**
 * This is a vite environment variable showing whether the app is being run from
 * `electron-vite dev`.
 */
const isDevVite = import.meta.env.DEV;

const useEnvironment = () => {
  const { data: environment } = trpcReact.environments.get.useQuery();
  const { mutate: setIsProd } = trpcReact.environments.set.useMutation();
  const {
    data: devEnabled,
  } = trpcReact.environments.devEnabled.useQuery();

  const isProd = useMemo(() => environment === 'prod', [environment]);
  const mode = useMemo((): RunMode => {
    if (isDevVite) return 'dev';
    if (devEnabled) return 'preview';
    return 'prod';
  }, [isDevVite, devEnabled]);
  const toggleEnvironment = useCallback(
    () => setIsProd(isProd ? 'dev' : 'prod'), [isProd]
  );

  return {
    isProd,
    mode,
    toggleEnvironment,
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
  const { isProd, mode, toggleEnvironment } = useEnvironment();
  const { item: expanded, setItem: setExpanded } = usePersistent('devModeDrawerExpanded');
  const { item: isFixedPosition, setItem: setFixedPosition } = usePersistent('devModeDrawerFixedPosition');

  const { theme: { colors: { info, warning } } } = useTheme();
  const color = useMemo(() => {
    if (mode === 'dev') return info.main;
    if (mode === 'preview') return '#70f';
    return warning.main;
  }, [mode]);
  const { pathname, search } = useLocation();

  const handleToggleEnv = () => {
    const confirmChange = window.confirm(`Switch to ${!isProd ? 'PRODUCTION' : 'DEVELOPMENT'}? The app will reload.`);
    if (confirmChange) {
      toggleEnvironment();
    }
  };

  return (
    <Box sx={{ position: isFixedPosition ? 'fixed' : 'relative', top: 0, left: 0, right: 0, zIndex: expanded ? 1500 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* The Collapsible Content */}
      <Collapse in={expanded} sx={{ width: '100%' }}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 0, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center" flexWrap={'wrap'}>
            <Grid sx={{ flexBasis: '120px' }}>
              <Stack>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BuildCircleIcon fontSize="small" /> Dev Engine
                </Typography>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Start fontSize="small" /> {new Date().toLocaleTimeString()}
                </Typography>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Layers fontSize="small" /> {mode.toUpperCase()}
                </Typography>
              </Stack>
            </Grid>

            <Grid sx={{ flex: '1 0 180px' }}>
              <FormControlLabel
                control={<Switch checked={isProd} onChange={handleToggleEnv} color="warning" sx={{ color }} />}
                label={isProd ? "PRODUCTION DATABASE" : "DEVELOPMENT DATABASE"}
              />
              <FormControlLabel
                control={<Switch checked={isFixedPosition} onChange={(_, checked) => setFixedPosition(checked)} sx={{ color }} />}
                label={"FIXED POSITION"}
              />
            </Grid>

            <Grid container sx={{ flex: '1 0 270px' }} spacing={2} flexWrap={'wrap'}>
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
