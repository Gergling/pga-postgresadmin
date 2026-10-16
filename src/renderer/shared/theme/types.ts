import { CSSProperties } from "@mui/material";
import { SEMANTIC_NAMES_MESSAGE, zeroGDSDark } from "@gergling/ui-components";

export type NeonShadowProps = {
  blur?: string;
  color?: string;
  shadow?: {
    box?: boolean;
    filter?: boolean;
    text?: boolean;
  };
};

export type NeonShadowResponse = Partial<
  Pick<CSSProperties, 'boxShadow' | 'filter' | 'textShadow'>
>;

export type ZeroGdsDarkTheme = typeof zeroGDSDark;
export type SemanticNames = typeof SEMANTIC_NAMES_MESSAGE[number];
