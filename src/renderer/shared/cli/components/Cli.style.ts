import styled from '@emotion/styled';

export const CLIContainer = styled.div`
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Courier New', Courier, monospace;
  padding: 20px;
  height: 400px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
`;

export const CLIOutput = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`;

export const CLILineStyled = styled.div<{ type: string }>`
  margin-bottom: 5px;
  color: ${(props) => (props.type === 'error' ? '#f44747' : props.type === 'prompt' ? '#569cd6' : '#d4d4d4')};
`;

export const CLIInputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const CLIInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  outline: none;
  width: 100%;
  font-family: inherit;
  margin-left: 10px;
`;
