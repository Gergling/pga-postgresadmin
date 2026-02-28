import { useMemo } from "react";
import { COLORS, neonFilterDropShadow } from "../../theme";
import { StyledProgressBar, StyledProgressBarSegment } from "./ProgressBar.style";

export type ProgressBarSegmentProps = {
  message: string;
  status: 'pending' | 'flawed' | 'complete';
};

const ProgressBarSegment = ({
  message,
  status,
  width,
}: ProgressBarSegmentProps & { width: number; }) => {
  const props = useMemo(() => {
    const backgroundColor = status === 'complete' ? COLORS.bloodRed : 'transparent';
    const borderColor = status === 'flawed' ? COLORS.goldGlow : COLORS.bloodGlow;
    const filter = neonFilterDropShadow(borderColor);
    return { backgroundColor, borderColor, filter };
  }, [status]);
  return <StyledProgressBarSegment {...props} width={`${width}%`}>{message}</StyledProgressBarSegment>;
};

export type ProgressBarProps = {
  segments: ProgressBarSegmentProps[];
};

export const ProgressBar = ({
  segments
}: ProgressBarProps) => {
  const width = useMemo(() => segments.length ? 100 / segments.length : 100, [segments]);
  return <StyledProgressBar>
    {segments.map((segment, index) => <ProgressBarSegment key={index} width={width} {...segment} />)}
  </StyledProgressBar>;
};
