import styled from '@emotion/styled';

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
