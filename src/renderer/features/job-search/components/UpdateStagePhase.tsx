import { motion, AnimatePresence } from 'framer-motion';
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { APPLICATION_PHASE_FSM } from '../constants';

// 1. The Container with the "Fading Horizon" masks
const PhaseWindow = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  // The "Registry Darkness" - fades out the edges
  maskImage: 'linear-gradient(to right, transparent, black 40%, black 60%, transparent)',
  backgroundColor: '#050202',
});

// 2. The Vascular Line (The Connector)
const BloodLine = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  height: '1px',
  backgroundColor: alpha('#ff0000', 0.2),
  zIndex: 1,
});

// 3. The Individual Node
const Node = styled(motion.div)<{ active: boolean; past: boolean }>(({ active, past }) => ({
  width: active ? '14px' : '8px',
  height: active ? '14px' : '8px',
  borderRadius: '50%',
  backgroundColor: active || past ? '#ff0000' : 'transparent',
  border: `1px solid ${past || active ? '#ff0000' : alpha('#ff0000', 0.4)}`,
  boxShadow: active ? '0 0 15px #ff0000' : 'none',
  zIndex: 2,
  flexShrink: 0,
}));

const allPhases = Object.values(APPLICATION_PHASE_FSM);

// 4. Component Logic
export const LinearPhaseView = ({ currentPhase }: { currentPhase: string; }) => {
  const currentIndex = allPhases.findIndex(p => p.name === currentPhase);
  
  // Calculate the offset to keep the current index centered
  const nodeWidth = 80; // Distance between nodes
  const offset = -(currentIndex * nodeWidth);

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <PhaseWindow>
        <BloodLine />
        <motion.div
          animate={{ x: offset }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          style={{ display: 'flex', alignItems: 'center', gap: `${nodeWidth - 10}px` }}
        >
          {allPhases.map((phase, index) => (
            <Box key={phase.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
              <Node 
                active={index === currentIndex} 
                past={index < currentIndex}
                animate={index === currentIndex ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              {/* Optional: Tiny label for non-active nodes if you have space */}
            </Box>
          ))}
        </motion.div>
      </PhaseWindow>

      {/* The Focused Display (Surgical Precision) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <Typography variant="overline" sx={{ color: '#ff0000', fontWeight: 900, letterSpacing: '0.2em' }}>
            {currentPhase.toUpperCase()}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', color: alpha('#fff', 0.5), fontStyle: 'italic' }}>
            {allPhases[currentIndex]?.description || 'Awaiting Update...'}
          </Typography>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};
