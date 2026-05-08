export type PanelDataItem = ({
  display: 'chip';
  value: number;
} | {
  display: 'sparkline';
  value: number[];
}) & {
  name: string;
  label: string;
  weight: number;
};

// export type PanelChipData = {
//   display: 'chip';
//   type: 'recency'; // Can also be an abstract score, or a 0-100 score, or just a quantity or something, I guess.
//   label: string;
//   name: string;
//   value: number;
//   weight: number;
// };

// export type PanelSparklineData = {
//   display: 'sparkline';
//   type: 'recency';
//   label: string;
//   name: string;
//   value: number[];
//   weight: number;
// };

// Leave room for things like sparklines.
export type PanelData = PanelDataItem[];
