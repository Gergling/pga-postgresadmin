import styled, { CSSObject } from "@emotion/styled";
import { COLORS, neonFilterDropShadow } from "../../theme";

const decor = (backgroundColor: string): CSSObject => ({
  content: '""',
  left: 0,
  backgroundColor,
  position: 'absolute',
});

const verticalDecor = (
  color: string, thickness: number, width: number
): CSSObject => ({
  ...decor(color),
  filter: neonFilterDropShadow(color),
  top: -width,
  width: thickness,
});

export const ListItem = styled.div<{
  color?: string;
  height?: number;
  width?: number;
}>(({
  color = COLORS.bloodGlow, height = 1, width = 20
}) => {
  const thickness = height * 2;
  return {
    position: 'relative',
    marginLeft: width,
    paddingLeft: width,
    paddingBottom: width,
    overflow: 'hidden',

    // Vertical Decor
    '&:before': {
      ...verticalDecor(color, thickness, width),
      bottom: 0,
    },

    // First child of the item is used as the guide for the decor.
    '& > :first-child': {
      '& > :first-child': {
        position: 'relative',

        // Horizontal Decor
        '&:after': {
          ...decor(color),
          left: -width,
          width,
          top: '50%',
          marginTop: -height,
          height: thickness,
        },
      },
    },
    '&:last-child': {
      paddingBottom: 0,
      // Vertical decor gets an override on the last child so that it only
      // extends to the horizontal decor.
      '&:before': {
        height: 0,
        width: 0,
      },

      // That involves assigning it to the first child of the last child.
      '& > :first-child': {
        position: 'relative',
        '&:before': {
          ...verticalDecor(color, thickness, width),
          bottom: '50%',
          left: -width,
        },
      },
    },
  };
});
export const List = styled.div<{ indent?: number; }>(({ indent = 20 }) => ({
  marginLeft: indent,
}));
