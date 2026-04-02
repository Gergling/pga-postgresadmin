import styled from '@emotion/styled';
import { Paper, Typography, Button } from '@mui/material';

export const FormContainer = styled(Paper)`
  background: rgba(10, 10, 15, 0.9);
  border: 1px solid rgba(255, 0, 51, 0.3);
  padding: 24px;
  // max-width: 500px;
  backdrop-filter: blur(10px);
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

export const SectionLabel = styled(Typography)`
  font-family: 'Orbitron', sans-serif;
  color: #ffcc00; /* Alchemist Gold */
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.75rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 0, 51, 0.5), transparent);
  }
`;

export const SubmitButton = styled(Button)`
  background: transparent;
  color: #ff0033; /* Neon Blood */
  border: 1px solid #ff0033;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  margin-top: 24px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 0, 51, 0.1);
    border-color: #ff0033;
    box-shadow: 0 0 15px rgba(255, 0, 51, 0.4);
    color: #fff;
  }
`;
