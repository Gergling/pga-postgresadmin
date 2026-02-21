import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const smokeFlicker = keyframes`
  0% { text-shadow: 0 0 0px #ffcc00; opacity: 0.8; }
  50% { text-shadow: 0 -5px 15px #d40000; opacity: 1; }
  100% { text-shadow: 0 0 0px #ffcc00; opacity: 0.8; }
`;

export const InputContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  width: 100%;

  &:focus-within {
    .input-glow-line {
      opacity: 1;
    }
  }
`;

export const RitualLabel = styled.label`
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #700; /* Blood Red */
  letter-spacing: 0.2rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

export const VentingArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  background: transparent;
  border: none;
  /* Only a bottom border, but we use a clip-path for that 'cut' look */
  border-bottom: 1px solid #400;
  color: #ffcc00; /* Alchemist Gold */
  font-family: 'JetBrains Mono', monospace;
  padding: 10px 0;
  resize: none;
  outline: none;
  transition: all 0.4s ease-in-out;

  &::placeholder {
    color: #400;
    font-style: italic;
  }

  &:focus {
    border-bottom: 1px solid #ffcc00;
    /* The 'Smoke' effect */
    animation: ${smokeFlicker} 2s infinite alternate;
    /* Creating the angled corner highlight */
    clip-path: polygon(0 0, 100% 0, 100% 70%, 98% 100%, 0 100%);

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      opacity: 0;
      background: linear-gradient(90deg, transparent, #ffcc00, transparent);
      transition: opacity 0.4s;
    }
  }
    
  &:focus-within {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      opacity: 0;
      background: linear-gradient(90deg, transparent, #ffcc00, transparent);
      transition: opacity 0.4s;
    }
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    opacity: 0;

    &:focus {
      background: linear-gradient(90deg, transparent, #ffcc00, transparent);
      transition: opacity 0.4s;
    }
  }
  &:focus-within::after {
    background: linear-gradient(90deg, transparent, #ffcc00, transparent);
    transition: opacity 0.4s;
  }
`;

export const InputGlow = styled('div')`
  className: input-glow-line;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ffcc00, transparent);
  // opacity: 0;
  transition: opacity 0.4s;
`;
  // ${VentingArea}:focus + & {
    // opacity: 1;
  // }
