import { Drawer, TextareaAutosize, ClickAwayListener, Portal, Box, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import { useDiary } from '../context';
import { DiaryEntryInput } from './DiaryEntryInput';
import { DiaryEntryInputText } from './EntryInputText';

// We style the MUI Drawer's internal 'Paper' component
const StyledDrawer = styled(Drawer)`
  & .MuiPaper-root {
    width: 400px;
    // background: rgba(10, 10, 15, 0.95);
    backdrop-filter: blur(12px);
    // border-left: 2px solid #ff0033; /* Neon Blood */
    color: #fff;
    overflow: visible; /* Allows the Tab to stick out */
    pointer-events: auto;

    /* The Fix: Stop it from filling the screen */
    height: auto; 
    max-height: 80vh;
    
    /* Position it in the middle of the right edge */
    top: 50%;
    transform: translateY(-50%) !important; 
    
    /* Aesthetic: Rounded 'Slate' look */
    border-radius: 12px 0 0 12px;
    background: rgba(10, 10, 15, 0.98);
    border: 2px solid #ff0033;
    border-right: none;
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.8);
  }
`;

const DiaryArea = styled(TextareaAutosize)`
  width: 100%;
  background: transparent;
  color: #ffcc00; /* Alchemist Gold */
  border: 1px solid rgba(255, 0, 51, 0.3);
  font-family: 'JetBrains Mono', monospace;
  padding: 15px;
  outline: none;
  &:focus {
    border-color: #ffcc00;
  }
`;
const HandleTab = styled.button`
  pointer-events: auto; /* Re-enable clicks */
  width: 40px;
  height: 80px;
  background: #0a0a0f;
  border: 1px solid #ff0033; /* Neon Blood */
  border-right: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -4px 0 15px rgba(255, 0, 51, 0.3);
  color: #ffcc00; /* Alchemist Gold */
  
  &:hover {
    background: #151520;
    box-shadow: -4px 0 20px rgba(255, 0, 51, 0.5);
  }
`;

export const DiaryDrawer = () => {
  const { drawer: { setIsOpen, isOpen , isAvailable} } = useDiary();

  // If the page (like a dedicated Drawer Page) shouldn't show the tab, we exit
  if (!isAvailable) return null;

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Portal> {/* Renders at the end of <body> to avoid Z-index hell */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            zIndex: 1300,
            pointerEvents: 'none', // The 'Ghost' Fix
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <HandleTab
            onClick={() => setIsOpen(!isOpen)} 
            style={{ pointerEvents: 'auto' }} 
          />
          
          <StyledDrawer 
            variant="persistent" 
            anchor="right" 
            open={isOpen}
            sx={{ pointerEvents: 'auto' }}
          >
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{ position: 'absolute', top: 10, right: 10 }}
            >
              Close
            </IconButton>
            <DiaryEntryInputText />
          </StyledDrawer>
        </Box>
      </Portal>
    </ClickAwayListener>
  );
};
