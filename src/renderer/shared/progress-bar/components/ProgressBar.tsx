import { useMemo } from "react";
import { COLORS, neonFilterDropShadow } from "../../theme";
import {
  StyledProgressBarAnimated,
  StyledProgressBarBoolean,
  StyledProgressBarBooleanContainer,
  StyledProgressBarSegment
} from "./ProgressBar.style";
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

type ProgressBarBaseProps = {
  discrete?: boolean;
  style?: React.CSSProperties;
};
type ProgressBarBooleanProps = ProgressBarBaseProps & { value: number; };
type ProgressBarSegmentsProps = ProgressBarBaseProps & { segments: ProgressBarSegmentProps[]; };

export type ProgressBarProps = 
  | ProgressBarBaseProps
  | ProgressBarBooleanProps
  | ProgressBarSegmentsProps
;

const ProgressBarBoolean = ({ style, value }: ProgressBarBooleanProps) => {
  return <StyledProgressBarBooleanContainer style={style}>
    <StyledProgressBarBoolean style={{ width: `${value * 100}%` }} />
  </StyledProgressBarBooleanContainer>
};

const ProgressBarSegments = ({
  discrete, ...props
}: ProgressBarSegmentsProps) => {
  return <Grid
    columns={props.segments.length}
    container
    spacing={1}
    sx={{
      borderColor: COLORS.bloodGlow,
      borderWidth: discrete ? 0 : 1,
    }}
  >
    {props.segments.map((segment, index) => <ProgressBarSegment
      key={index} discrete={discrete} {...segment}
    />)}
  </Grid>;
};

export const ProgressBar = (props: ProgressBarProps) => {
  const discrete = useMemo(() => {
    if (props.discrete !== undefined) return props.discrete;
    if (!('segments' in props)) return false;
    if (props.segments.length < 60) return true;
    return false;
  }, [props]);

  if ('value' in props) return <ProgressBarBoolean {...props} discrete={discrete} />;

  if ('segments' in props) return <ProgressBarSegments {...props} discrete={discrete} />;

  return <StyledProgressBarBooleanContainer style={props.style}>
    <StyledProgressBarAnimated />
  </StyledProgressBarBooleanContainer>;
};
