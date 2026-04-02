import { useMemo } from "react";
import { COLORS, neonFilterDropShadow } from "../../theme";
import { StyledProgressBar, StyledProgressBarSegment } from "./ProgressBar.style";
import { Grid } from "@mui/material";

export type ProgressBarSegmentProps = {
  discrete?: boolean;
  message?: string;
  status: 'red-outline' | 'gold-outline' | 'red-background';
};

const ProgressBarSegment = ({
  discrete,
  message = '',
  status,
}: ProgressBarSegmentProps) => {
  const props = useMemo(() => {
    const backgroundColor = status === 'red-background'
      ? COLORS.bloodRed : 'transparent';
    const borderColor = status === 'gold-outline'
      ? COLORS.goldGlow : COLORS.bloodGlow;
    const filter = neonFilterDropShadow(borderColor);
    const borderWidth = discrete ? '2px' : 0;
    return { backgroundColor, borderColor, borderWidth, filter };
  }, [discrete, status]);

  return <Grid
    size={1}
  >
    <StyledProgressBarSegment
      {...props}
      // width={`${width}%`}
    >{message}</StyledProgressBarSegment>
  </Grid>
};

export type ProgressBarProps = {
  discrete?: boolean;
  segments: ProgressBarSegmentProps[];
};

export const ProgressBar = ({
  segments,
  ...props
}: ProgressBarProps) => {
  const discrete = useMemo(() => {
    if (props.discrete !== undefined) return props.discrete;
    if (segments.length < 60) return true;
    return false;
  }, [props.discrete]);
  return <Grid
    columns={segments.length}
    container
    // gap={'0.4rem'}
    spacing={1}
    // justifyContent={'stretch'}
    // sx={{ m: 1, p: 1 }}
    sx={{
      borderColor: COLORS.bloodGlow,
      borderWidth: discrete ? 0 : 1,
      // filter: neonFilterDropShadow(COLORS.bloodGlow),
    }}
  >
    {segments.map((segment, index) => <ProgressBarSegment
      key={index}
      discrete={discrete}
      {...segment}
    />)}
  </Grid>;
};
