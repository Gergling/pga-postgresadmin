import styled from '@emotion/styled';
import { TextField } from '@mui/material';

export const StyledTaskDescriptionInput = styled(TextField)<{ isTitle?: boolean }>`
  width: 100%;
  
  & .MuiInputBase-root {
    color: #fff;
    font-family: ${props => props.isTitle ? "'Orbitron', sans-serif" : "'JetBrains Mono', monospace"};
    font-size: ${props => props.isTitle ? '1.5rem' : '1rem'};
    font-weight: ${props => props.isTitle ? 700 : 400};
    line-height: 1.6;
    padding: 8px 0;
    transition: background 0.3s ease;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  /* The Neon Blood Filament (Underline) */
  & .MuiInputBase-root::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: #ff0033;
    box-shadow: 0 0 8px #ff0033, 0 0 15px #ff0033;
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
