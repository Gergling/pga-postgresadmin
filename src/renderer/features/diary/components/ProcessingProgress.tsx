import { styled, keyframes } from '@mui/material';
import { useDiary } from '../context';
import { useMemo } from 'react';

const pulseGold = keyframes`
  0% { box-shadow: 0 0 5px #D4AF37; }
  50% { box-shadow: 0 0 20px #D4AF37; }
  100% { box-shadow: 0 0 5px #D4AF37; }
`;

// TODO: We only need isProcessing as a boolean.
const VialContainer = styled('div')<{ isConverging: boolean; }>(({ isConverging }) => ({
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
const BloodFill = styled('div')<{ progress: number; }>(({ progress }) => {
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

const ShineOverlay = styled('div')({
  position: 'absolute',
  top: '5%',
  left: '15%',
  width: '30%',
  height: '90%',
  background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
  borderRadius: '10px',
  pointerEvents: 'none',
});

export const DiaryTaskProcessingProgress = () => {
  // We have a proper hook for this.
  const { isConverging, progress } = useDiary();

  const status = useMemo(() => {
    if (isConverging) return 'CONVERGING';
    if (progress === 0) return 'EMPTY';
    return 'FILLING';
  }, [isConverging, progress]);

  return (
    <div style={{ position: 'fixed', right: '20px', bottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <VialContainer isConverging={isConverging}>
        <BloodFill progress={progress} />
        <ShineOverlay />
      </VialContainer>
      <span style={{ color: '#D4AF37', fontSize: '10px', fontFamily: 'monospace' }}>
        {status}
      </span>
    </div>
  );
};
