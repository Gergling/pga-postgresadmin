import styled from "@emotion/styled";
import { Hazard } from "../base";
import { COLORS } from "../theme";

export const StyledRedactor = styled(Hazard)({
  '&::after': {
    background: COLORS.bloodRed,
    content: '"Click to declassify"',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.9,
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  '&:hover': {
    '&::after': {
      color: 'transparent',
      opacity: 0.7,
    }
  }
});
