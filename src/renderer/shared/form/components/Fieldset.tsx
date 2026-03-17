import React, { PropsWithChildren } from 'react';
import { StyledFieldset } from './Fieldset.style';

export const Fieldset = ({ legend, children, ...props }: PropsWithChildren & { legend?: React.ReactNode }) => {
  return <StyledFieldset {...props}>
    {legend && <legend>{legend}</legend>}
    {children}
  </StyledFieldset>;
};
