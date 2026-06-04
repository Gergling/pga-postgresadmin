export type PanelDataItem = ({
  display: 'chip';
  value: number;
} | {
  display: 'sparkline';
  value: number[];
}) & {
  name: string;
  label: string;
  weights: {
    achievement: number;
    opportunity: number;
  };
};

// Leave room for things like sparklines.
export type PanelData = PanelDataItem[];
