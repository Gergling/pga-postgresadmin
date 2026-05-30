import { Grid } from "@mui/material";
import { Children } from "react";
import { ParentheticalContainer } from "./Brackets.style";
import { StyledParentheticalBreadcrumbSeparator } from "./Breadcrumbs.style";
import { FadeLine } from "../../common";

type ParentheticalGridProps = {
  children: React.ReactNode;
  separator?: 'default' | React.ReactNode | null;
  styleOverrides?: {
    container?: Parameters<typeof Grid>[0];
    item?: Parameters<typeof Grid>[0];
    parenthetical?: Parameters<typeof ParentheticalContainer>[0];
  };
};

export const ParentheticalGrid = ({
  children,
  separator = 'default',
  styleOverrides,
}: ParentheticalGridProps) => {
  const { container, item, parenthetical } = styleOverrides || {};
  const childrenArray = Children.toArray(children);
  const separatorComponent = separator === 'default'
    ? <StyledParentheticalBreadcrumbSeparator style={{ height: 0 }} />
    : separator;
  return <Grid
    container
    justifyContent={'center'}
    {...container}
  >
    <Grid container alignSelf={'center'} size={'grow'}>
      <Grid size={6} offset={6}>
        <FadeLine direction={'right'} thickness={4} />
      </Grid>
    </Grid>
    {childrenArray.map((child, index) => {
      const isLast = index === childrenArray.length - 1;
      return <>
        <Grid key={index} {...item}>
          <ParentheticalContainer
            roundness={0} style={{ padding: '0.5rem' }} {...parenthetical}
          >
            <div style={{ display: 'flex', gap: '0.5rem', margin: '0.25rem'}}>
              {child}
            </div>
          </ParentheticalContainer>
        </Grid>
        {!isLast && <Grid alignSelf={'center'}>{separatorComponent}</Grid>}
      </>;
    })}
    <Grid container alignSelf={'center'} size={'grow'}>
      <Grid size={6}>
        <FadeLine thickness={4} />
      </Grid>
    </Grid>
  </Grid>;  
};
