import { styled, keyframes, alpha } from '@mui/material/styles';
import { Box, Typography, LinearProgress } from '@mui/material';

// 1. The Urgency Pulse Animation
const pulse = (color: string) => keyframes`
  0% { box-shadow: 0 0 0 0 ${alpha(color, 0.4)}; }
  70% { box-shadow: 0 0 0 6px ${alpha(color, 0)}; }
  100% { box-shadow: 0 0 0 0 ${alpha(color, 0)}; }
`;

interface CardProps {
  type: 'action' | 'radar';
  urgencyLevel?: number; // 0 (low) to 3 (critical)
}

// 2. The Main Container
export const MicroCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'type' && prop !== 'urgencyLevel',
})<CardProps>(({ theme, type, urgencyLevel = 0 }) => ({
  backgroundColor: '#0a0505',
  padding: theme.spacing(1.5),
  borderRadius: '2px', // Sharp, tactical corners
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, background-color 0.2s ease',
  
  // Border Logic: Solid for Action, Dotted for Radar
  border: `1px ${type === 'radar' ? 'dashed' : 'solid'} ${
    type === 'radar' ? alpha('#ff0000', 0.3) : '#ff0000'
  }`,

  // Urgency Glow
  animation: urgencyLevel > 1 ? `${pulse('#ff0000')} 2s infinite` : 'none',

  '&:hover': {
    backgroundColor: '#0f0808',
    transform: 'translateX(4px)',
    borderColor: '#ff0000',
  },
}));

// 3. The Rune/Icon Wrapper
export const RuneWrapper = styled(Box)(({ theme }) => ({
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ff0000',
  fontSize: '1.2rem',
  filter: 'drop-shadow(0 0 2px #ff0000)',
}));

// 4. The Header Layout (Company + Rune)
export const CardHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
});

// 5. Tactical Progress Bar (for Prep Levels)
export const PrepBar = styled(LinearProgress)(({ theme }) => ({
  height: 4,
  borderRadius: 0,
  backgroundColor: alpha('#ff0000', 0.1),
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#ff0000',
    boxShadow: '0 0 5px #ff0000',
  },
}));

// 6. Metadata Text
export const MetaText = styled(Typography)(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  color: alpha('#ff0000', 0.6),
  textTransform: 'uppercase',
}));
