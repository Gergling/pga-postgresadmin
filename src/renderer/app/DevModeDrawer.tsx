import { useMemo, useState } from 'react';
import { Box, Collapse, ButtonBase, Paper, Typography, Switch, FormControlLabel, Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { useIpc } from '../shared/ipc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTheme } from '@gergling/ui-components';
import { useLocation } from 'react-router-dom';

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

export const DevModeOverlay = () => {
  const { isProd, setIsProd } = useEnvironment();
  const [expanded, setExpanded] = useState(false);
  const { theme: { colors: { info, warning } } } = useTheme();
  const color = useMemo(() => isProd ? warning.main : info.main, [isProd]);
  const { pathname } = useLocation();

  const handleToggleEnv = () => {
    const confirmChange = window.confirm(`Switch to ${!isProd ? 'PRODUCTION' : 'DEVELOPMENT'}? The app will reload.`);
    if (confirmChange) {
      setIsProd(!isProd);
    }
  };

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: expanded ? 1500: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* The Collapsible Content */}
      <Collapse in={expanded} sx={{ width: '100%' }}>
        <Paper elevation={4} sx={{ p: 2, borderRadius: 0, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">
            <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <BuildCircleIcon fontSize="small" /> Dev Engine
            </Typography>
            
            <FormControlLabel
              control={<Switch checked={isProd} onChange={handleToggleEnv} color="warning" sx={{ color }} />}
              label={isProd ? "PRODUCTION DATABASE" : "DEVELOPMENT DATABASE"}
            />
            
            {/* You can add more dev-only tools here later */}
            <Typography variant="caption" color="text.secondary">
              Path: { pathname }
            </Typography>
          </Stack>
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
