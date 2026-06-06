import React from 'react';
import './CLI.css';
import { CLIContainer, CLIInput, CLIInputWrapper, CLILineStyled, CLIOutput } from './Cli.style';

// Define the shape of a single line of output
export interface CLILine {
  id: string;
  text: string;
  type: 'info' | 'error' | 'prompt';
}

interface CLIProps {
  history: CLILine[];
  currentInput: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const CLI: React.FC<CLIProps> = ({ history, currentInput, onInputChange, onKeyDown }) => {
  return (
    <CLIContainer>
      <CLIOutput>
        {history.map((line) => (
          <CLILineStyled key={line.id} type={line.type}>
            {line.text}
          </CLILineStyled>
        ))}
      </CLIOutput>
      <CLIInputWrapper>
        <span>{' > '}</span>
        <CLIInput
          type="text"
          value={currentInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
        />
      </CLIInputWrapper>
    </CLIContainer>
  );
};