import { PropsWithChildren } from "react";
import { AppThemeProvider } from "@gergling/ui-components";
import { TypographyStyleOptions } from "@mui/material/styles/createTypography";
import { COLORS } from "./colors";

const headerTags: (keyof TypographyStyleOptions)[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const headerOverrides = headerTags.reduce((acc, tag) => ({
  ...acc,
  [tag]: {
    color: COLORS.bloodGlow,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
}), {});

export const AppThemeOverrideProvider = ({ children }: PropsWithChildren) => {
  return <AppThemeProvider themeOverrides={{
    typography: {
      fontFamily: [
        'Orbitron',
        'sans-serif',
      ].join(','),
      ...headerOverrides,
    }
  }}>{children}</AppThemeProvider>;
};
