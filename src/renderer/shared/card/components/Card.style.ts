import { styled, alpha } from '@mui/material/styles';
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  CardHeader as MuiCardHeader,
  Typography
} from '@mui/material';
import { COLORS } from '../../theme';

// 1. The Main Vessel (Card Container)
export const Card = styled(MuiCard)(({ theme }) => ({
  backgroundColor: '#0a0505', // Deep "clotted" black
  border: `1px solid ${alpha(COLORS.bloodRed, 0.4)}`,
  borderRadius: '2px', // Sharp, surgical corners
  position: 'relative',
  overflow: 'visible',
  backgroundImage: 'none', // Remove MUI's default elevation overlay
  transition: 'all 0.2s ease-in-out',
  
  // Subtle Scanline Overlay
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
    backgroundSize: '100% 2px, 3px 100%',
    pointerEvents: 'none',
    zIndex: 1,
  },

  '&:hover': {
    borderColor: COLORS.bloodGlow,
    boxShadow: `0 0 12px ${alpha(COLORS.bloodGlow, 0.2)}`,
  },
}));

// 2. The Header (Registry Meta)
export const CardHeader = styled(MuiCardHeader)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(COLORS.bloodRed, 0.2)}`,
  padding: theme.spacing(1, 1.5),
  '& .MuiCardHeader-title': {
    color: COLORS.ruddy,
    fontSize: '0.85rem',
    fontWeight: 900,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  '& .MuiCardHeader-subheader': {
    color: COLORS.goldGlow, // Use gold for meta-info/warnings
    fontSize: '0.65rem',
    fontWeight: 700,
  },
}));

// 3. The Content (The Core Pulse)
export const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: theme.spacing(1.5),
  position: 'relative',
  zIndex: 2,
  '&:last-child': { paddingBottom: theme.spacing(1.5) },
}));

// 4. Action Area (The Commit Buttons)
export const CardActions = styled(MuiCardActions)(({ theme }) => ({
  borderTop: `1px solid ${alpha(COLORS.bloodRed, 0.1)}`,
  justifyContent: 'flex-end',
  padding: theme.spacing(0.5, 1),
  backgroundColor: alpha(COLORS.bloodRed, 0.02),
}));

// 5. Special Text for "Registry Entries"
export const RegistryData = styled(Typography)({
  fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
  fontSize: '0.75rem',
  color: alpha('#fff', 0.8),
  '& b': {
    color: COLORS.bloodGlow,
    fontWeight: 700,
  }
});
