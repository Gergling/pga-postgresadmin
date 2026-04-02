import styled from '@emotion/styled';
import { TextField } from '@mui/material';

export const DossierContainer = styled.div`
  background: #050505;
  border: 1px solid #700;
  padding: 2rem;
  font-family: 'JetBrains Mono', monospace;
  color: #ffcc00; /* Alchemist Gold */
  position: relative;
`;

export const HeaderSection = styled.header`
  border-bottom: 2px double #700;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
`;

export const CouncilVerdictGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

export const MemberSigil = styled.div<{ color: string }>`
  border: 1px solid ${props => props.color};
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 10px ${props => props.color}33;
  
  label {
    display: block;
    font-size: 0.6rem;
    color: ${props => props.color};
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
`;

export const VoteValue = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  text-shadow: 0 0 5px #ffcc00;
`;

export const Main = styled.div`
  display: flex;
  gap: 1rem;
`;

export const StyledTaskDescriptionInput = styled(TextField)`
  & .MuiInputBase-root {
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    padding: 0;
    transition: all 0.3s ease;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none; /* Hide the box */
  }

  &:hover .MuiInputBase-root, 
  & .Mui-focused .MuiInputBase-root {
    background: rgba(255, 0, 51, 0.03);
  }

  /* The 'Filament' underline that appears on focus */
  & .MuiInputBase-root::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background: #ff0033;
    box-shadow: 0 0 8px #ff0033;
    transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }

  & .Mui-focused::after {
    width: 100%;
  }
`;
