import { CSSProperties } from "@mui/material";

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
