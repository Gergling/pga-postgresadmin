import {
  StyledParentheticalBreadcrumbs,
  StyledParentheticalBreadcrumbSeparator
} from './Breadcrumbs.style';
import { Children } from 'react';
import { ParentheticalContainer } from './Brackets.style';

export type ParentheticalBreadcrumbsProps = {
  children: React.ReactNode;
  styleOverrides?: {
    container?: Parameters<typeof StyledParentheticalBreadcrumbs>[0];
    item?: Parameters<typeof ParentheticalContainer>;
  };
};

export const ParentheticalBreadcrumbs = ({
  children, styleOverrides
}: ParentheticalBreadcrumbsProps) => {
  const { container, item } = styleOverrides || {};
  return <StyledParentheticalBreadcrumbs
    separator={<StyledParentheticalBreadcrumbSeparator />}
    {...container}
  >
    {Children.map(children, (child, key) => {
      return <ParentheticalContainer
        key={key} roundness={0} style={{ padding: '0.5rem' }} {...item}
      >
        <div style={{ display: 'flex', gap: '0.5rem', margin: '0.25rem'}}>
          {child}
        </div>
      </ParentheticalContainer>;
    })}
  </StyledParentheticalBreadcrumbs>;  
};
