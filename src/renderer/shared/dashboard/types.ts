export type PanelDataFeature = 'diary' | 'projects';

export type PanelDataValueChip = {
  display: 'chip';
  value: number | string;
};

export type PanelDataValueDelta = {
  display: 'delta';
  value: number;
};

export type PanelDataValueSparkline = {
  display: 'sparkline';
  value: number[];
};

export type PanelDataItem = (
  | PanelDataValueChip
  | PanelDataValueDelta
  | PanelDataValueSparkline
) & {
  feature: PanelDataFeature;
  id: string;
  label: string;
  name: string;
  weights: {
    achievement: number;
    opportunity: number;
  };
};

// Leave room for things like sparklines.
export type PanelData = PanelDataItem[];
