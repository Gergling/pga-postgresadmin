import { SvgNeonBlood } from "../themes";

const bluetooth = 'M30 25 L75 70 L50 95 L50 5 L75 30 L30 75';

export const Bluetooth = () => {
  return <SvgNeonBlood>
    <g transform="translate(-50, -50)">
      <path
        d={bluetooth}
        fill="none"
      />
    </g>
  </SvgNeonBlood>;
};
