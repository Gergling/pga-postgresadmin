import React, { PropsWithChildren } from 'react';
import { StyledFieldset, StyledLegend } from './Fieldset.style';

export const Fieldset = ({ legend, children, ...props }: PropsWithChildren & { legend?: React.ReactNode }) => {
  return <StyledFieldset {...props}>
    {legend
      ? <>
        <StyledLegend>{legend}</StyledLegend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {children}
        </div>
      </>
      : children
    }
  </StyledFieldset>;
};
