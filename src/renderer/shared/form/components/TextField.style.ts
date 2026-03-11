import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { COLORS } from '../../theme';

export const StyledTextField = styled(TextField)<{ isTitle?: boolean }>`
  width: 100%;
  
  & .MuiInputBase-root {
    color: #fff;
    font-family: ${props => props.isTitle ? "'Orbitron', sans-serif" : "'JetBrains Mono', monospace"};
    font-size: ${props => props.isTitle ? '1.5rem' : '1rem'};
    font-weight: ${props => props.isTitle ? 700 : 400};
    line-height: 1.6;
    padding: 8px 0;
    transition: background 0.3s ease;
    border-radius: 0;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
    border-bottom: 1px solid rgba(255, 0, 51, 0.3);
  }

  /* The Neon Blood Filament (Underline) */
  & .MuiInputBase-root::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: ${COLORS.ruddy};
    box-shadow: 0 0 8px ${COLORS.ruddy}, 0 0 15px ${COLORS.ruddy};
    transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }

  & .Mui-focused::after {
    width: 100%;
  }

  & .MuiInputBase-input::placeholder {
    color: rgba(255, 255, 255, 0.2);
    font-style: italic;
  }
`;
