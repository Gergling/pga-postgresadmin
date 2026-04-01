// Mostly this is for manual development/testing.
import { Box, Breakpoint } from "@mui/material";

const breakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

const defaultDisplay = breakpoints.reduce((acc, breakpoint) => ({
  ...acc,
  [breakpoint]: 'none',
}), {} as Record<Breakpoint, 'none'>);

export const ResponsiveIndicator = () => breakpoints.map((breakpoint) => <Box
  key={breakpoint}
  sx={{ display: {
    ...defaultDisplay,
    [breakpoint]: 'block'
  } }}>{breakpoint.toUpperCase()}</Box>
);
