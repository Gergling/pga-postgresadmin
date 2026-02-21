import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const slosh = keyframes`
  0% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-2px) scaleY(1.02); }
  100% { transform: translateY(0) scaleY(1); }
`;
const sloshAngle = keyframes`
  0% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
  100% { transform: rotate(-5deg); }
`;

const liquidFlow = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 1000%; }
`;

const sloshAnimation = keyframes`
  0% { 
    transform: rotate(-2deg) translateY(0px); 
  }
  25% {
    transform: translateY(-2px);
  }
  33% {
    transform: rotate(0deg);
  }
  50% { 
    transform: rotate(2deg) translateY(0px); 
  }
  67% { 
    transform: rotate(2deg);
  }
  75% {
    transform: translateY(-1px);
  }
  100% { 
    transform: rotate(-2deg) translateY(0px);
  }
`;

const bubbleRise = keyframes`
  0% { transform: translateY(100%) scale(0.5); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(-500%) scale(1.2); opacity: 0; }
`;

export const Bubble = styled.div<{ delay: number; speed: number }>`
  position: absolute;
  bottom: 0;
  left: ${() => (Math.random() * 70) + 15}%;
  width: 6px;
  height: 6px;
  background: #ffcc00;
  border-radius: 50%;
  filter: blur(1px); /* This helps with the gooey merge */
  animation: ${bubbleRise} ${props => props.speed}s infinite linear;
  animation-delay: ${props => props.delay}s;
`;

export const VialTube = styled.div`
  width: 20px;
  height: 100%;
  background: rgba(40, 0, 0, 0.4);
  // border: 1px solid #700;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 10px #000;
  filter: blur(1px) contrast(10);
`;

export const Fluid = styled.div<{ fillLevel: number }>`
  position: absolute;
  bottom: 0;
  width: 140%;
  left: -25%; 
  width: 150%;
  /* Dynamic height based on Convergence progress */
  height: ${props => props.fillLevel * 100}%; 
  
  background: linear-gradient(
    180deg, 
    #ffcc00 0%,   /* The "surface" glow */
    #d40000 20%,  /* The core blood red */
    #400 100%
  );
  
  /* The sloshing effect */
  animation: ${sloshAnimation} 5s ease-in-out infinite;
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: 50% 0;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* This creates the rising 'bubbles' or data fragments */
    background-image: radial-gradient(circle, #ffcc00 1px, transparent 1px);
    background-size: 10px 20px;
    animation: ${liquidFlow} 20s linear infinite;
    opacity: 0.3;
  }
`;

const pulseGold = keyframes`
  0% { box-shadow: 0 0 5px #D4AF37; }
  50% { box-shadow: 0 0 20px #D4AF37; }
  100% { box-shadow: 0 0 5px #D4AF37; }
`;

export const VialContainer = styled('div')<{ isConverging: boolean; }>(({ isConverging }) => ({
  width: '12px',
  height: '120px',
  backgroundColor: 'rgba(0,0,0,0.5)',
  border: `1px solid ${isConverging ? '#D4AF37' : '#333'}`,
  borderRadius: '10px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.5s ease',
  animation: isConverging ? `${pulseGold} 1.5s infinite` : 'none',
  display: 'flex',
  flexDirection: 'column-reverse', // Fill from bottom up
}));

// SyncStatus can be just the blood colour, which should just be the primary.
export const BloodFill = styled('div')<{ progress: number; }>(({ progress }) => {
  const colors = {
    empty: 'transparent',
    accumulating: '#990000', // Blood Red
    stale: '#4d3319',        // Stale Brown (Sepia-Cyber)
    processing: '#D4AF37',   // Gold
  };

  return {
    width: '100%',
    height: `${progress * 100}%`,
    backgroundColor: colors.accumulating,
    transition: 'height 0.3s ease, background-color 1s ease',
  };
});

export const ShineOverlay = styled('div')({
  position: 'absolute',
  top: '5%',
  left: '15%',
  width: '30%',
  height: '90%',
  background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
  borderRadius: '10px',
  pointerEvents: 'none',
});

export const SurfaceGlow = styled.div`
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 4px;
  background: #ffcc00;
  filter: blur(2px);
  box-shadow: 0 0 10px #ffcc00, 0 0 20px #d40000;
  z-index: 2;
`;
