import { alpha, IconButton, IconButtonProps, styled } from "@mui/material";
import { COLORS } from "../../../shared/theme";

type StyledAddStageButtonProps = IconButtonProps & {
  typeColor: string;
};

export const StyledAddStageButton = styled(IconButton)<StyledAddStageButtonProps>(({ typeColor }) => ({
  // backgroundColor: '#0a0505', // Deep "clotted" black
  border: `1px solid ${alpha(COLORS.bloodRed, 0.4)}`,
  borderRadius: '2px', // Sharp, surgical corners
  position: 'relative',
  overflow: 'visible',
  backgroundImage: 'none', // Remove MUI's default elevation overlay
  transition: 'all 0.2s ease-in-out',
  color: alpha(typeColor, 0.6),
  textShadow: `0 0 20px ${typeColor}`,
  
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
    backgroundColor: alpha(typeColor, 0.2),
    borderColor: typeColor,
    boxShadow: `inset 0 0 12px ${alpha(typeColor, 0.2)}`,
    color: alpha(typeColor, 0.9),
  },
}));
