import { useMemo } from "react";
import { Point } from "../types";
import { flipPoint, scale } from "../utilities";
import { SvgNeonBlood } from "./themes";
import {
  NEON_PLASMA_GLOW_CONFIG_NAMES,
  NeonPlasmaGlowConfigNames,
  SIZE_CONFIG,
  SizeName
} from "../config/neon";
import { GalleryItem } from "./Gallery";
import { Typography } from "@mui/material";
import { useTheme } from "@gergling/ui-components";
import { translate } from "../utilities/translate";
import { LETTERS_ORDERED_BY_FREQUENCY } from "../constants";

const width = 7;
const data = [
  ' ',' ',' ','e',' ',' ',' ',
  'n','c','g','b','s','u','t',
  ' ','p','x','j','v','r',' ',
  ' ','d','k','z','q','w',' ',
  'i','f','l','y','m','h','a',
  ' ',' ',' ','o',' ',' ',' ',
];
const height = Math.floor(data.length / width)
const cipher = data.reduce(
  (map, character, i) => {
    if (character === ' ') return map;
    const x = i % width;
    const y = Math.floor(i / width);
    return map.set(character, { x, y });
  },
  new Map<string, Point>()
);

// TODO: Alternative option: Put all the letters in a circle on the inner and outer circles.
// Could calculate how they should be proportioned between the inner and outer.
// So I guess that would be
// const breakdown = (26 / (inner + outer))
// const innerLetters = breakdown * inner;
// const outerLetters = breakdown * outer;

// const magicCircleCipher = LETTERS_ORDERED_BY_FREQUENCY.reduce(
//   (map, character, i) => {
//     const x = i % width;

// );


// This will take a string and return a series of points.
// TODO: Add containment lines where the sigil doesn't touch the sides.
const getSigilisedPoints = (str: string): Point[] => str.split('').reduce((acc, character) => {
  const point = cipher.get(character.toLowerCase());
  if (!point) return acc;
  return [...acc, point];
}, [] as Point[]);

const drawLinePath = ([{ x, y }, ...points]: Point[]) => [
  `M ${x} ${y}`,
  ...points.map(({ x, y }) => `L ${x} ${y}`),
].join(' ');

type SigiliserProps = {
  color?: NeonPlasmaGlowConfigNames;
  size: SizeName;
  str: string
};

const translation = { x: -width / 2, y: -height / 2 };
const getComparison = (value: number): -1 | 0 | 1 => {
  if (value < 0) return -1;
  if (value > 0) return 1;
  return 0;
};
const getPointComparison = ({ x, y }: Point) => ({
  x: getComparison(x),
  y: getComparison(y),
});

export const Sigiliser: React.FC<SigiliserProps> = ({ str, ...props }) => {
  const points = useMemo(
    () => {
      const points = getSigilisedPoints(str);
      const flags = points.reduce(
        (acc, { x, y }) => {
          if (x === 0) acc.left = false;
          if (x === width - 1) acc.right = false;
          if (y === 0) acc.top = false;
          if (y === height - 1) acc.bottom = false;
          return acc;
        },
        { top: true, bottom: true, left: true, right: true }
      );
      
      return points;
    },
    [str]
  );
  const d = useMemo(() => {
    const size = SIZE_CONFIG[props.size];
    const scaled = scale(size / width);
    const translated = translate(scaled.point(translation));
    const scaledPoints = points.map(scaled.point).map(translated.point);

    const flags = points.reduce(
      (map, { x, y }) => {
        if (x === 0) map.set('left', false);
        if (x === width - 1) map.set('right', false);
        if (y === 0) map.set('top', false);
        if (y === height - 1) map.set('bottom', false);
        return map;
      },
      new Map([['top', true], ['bottom', true], ['left', true], ['right', true]])
    );
    const edges = flags.entries().reduce((acc, [key, value]) => {
      if (!value) return acc;
      const instruction = ['top', 'bottom'].includes(key) ? 'H' : 'V';
      const position = key === 'top'
        ? 0
        : key === 'left'
          ? 0
          : key === 'bottom'
            ? size / (height - 1)
            : size / (width - 1);
      return [...acc, `${instruction} ${position}`];
    }, ['M 0 0']);

    const [{ x, y }, ...remaining] = scaledPoints;
    return remaining.reduce((acc, { x, y }, i) => {
      // Find the angle between the current and previous points in relation to the centre.
      const previous = i === 0 ? { x, y } : remaining[i - 1];
      const angleCurrent = Math.atan2(y, x);
      const anglePrevious = Math.atan2(previous.y, previous.x);
      const angleDifference = angleCurrent - anglePrevious;
      // If it's anti-clockwise, use an arc.
      if (angleDifference < 0) {
        // The control point can be in the appropriate corner.
        const controlPoint = scaled.point(getPointComparison({ x, y }));
        // Draw an arc using the control point
        const d = `Q ${controlPoint.x} ${controlPoint.y} ${x} ${y}`;
        return [...acc, d];
      }
      return [...acc, `L ${x} ${y}`];
    }, [...edges, `M ${x} ${y}`]).join(' ');
  }, [points, props.size]);
  return <SvgNeonBlood color={'blood'} {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};

export const sigilFactory = (str: string) => () => <Sigiliser str={str} size={'small'} />;

const DemoSigiliser: React.FC<Omit<SigiliserProps, 'size'>> = (
  props
) => <GalleryItem>
  <Sigiliser {...props} size={'large'} />
  <div style={{ display: 'flex' }}>
    <Sigiliser {...props} size={'medium'} />
    <Sigiliser {...props} size={'small'} />
  </div>
</GalleryItem>;

const DemoRow: React.FC<Omit<SigiliserProps, 'size'>> = ({
  str, ...props
}) => {
  const { theme: { colors: { primary } } } = useTheme();
  return <>
    <Typography variant="h6" sx={{
      textShadow: `0 0 5px ${primary.main}`,
      color: primary.main,
      textTransform: 'uppercase',
    }}>{str}</Typography>
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {NEON_PLASMA_GLOW_CONFIG_NAMES.map((colour) => <DemoSigiliser key={colour} color={colour} str={str} {...props} />)}
    </div>
  </>;
};

export const FullDemoSigiliser = () => {
  const { theme: { colors: { primary } } } = useTheme();
  // const seed = useTicker(() => Date.now(), 1997);
  return (
    <>
      <Typography variant="h5" sx={{
        textShadow: `0 0 5px ${primary.main}`,
        color: primary.main,
        textTransform: 'uppercase',
      }}>Rune Tators</Typography>
      <DemoRow str="Workflower" />
      <DemoRow str="Task" />
      <DemoRow str="Diary" />
      <DemoRow str="Eggshell" />
    </>
  );
};
