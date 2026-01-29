import { useCallback, useEffect, useMemo, useState } from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@gergling/ui-components";
import { GUIDES } from "../config";
import { NEON_PLASMA_GLOW_CONFIG_NAMES, NeonPlasmaGlowConfigNames, SIZE_CONFIG, SizeName } from "../config/neon";
import { mapLinePath } from "../paths";
import { Line, Point } from "../types";
import { describeArc, mapLine, polarToCartesian, scaleLine, translateLine } from "../utilities";
import { SvgNeonBlood } from "./themes";
import { GalleryItem } from "./Gallery";

const getInitialRuneLines = (): Record<RuneOrientationKey, Line[]> => {
  const totalPoints = 6;
  const centre: Point = { x: 0, y: 0 };
  const points = Array.from({ length: totalPoints }, (_, i) => {
    const angleDegrees = (i / totalPoints) * 360;
    return polarToCartesian(0, 0, GUIDES.outerRadius, angleDegrees);
  });
  const ring = points.map(mapLine);
  const star = points.map((point): Line => ({ start: centre, end: point }));
  return { ring, star };
};

/**
 * Converts a string into a 32-bit signed integer seed.
 * Uses a bitwise approach to ensure "abc" and "cba" produce different results.
 */
const stringToSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function getGenerator(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

type HexagonalKey = 0 | 1 | 2 | 3 | 4 | 5;
type RuneState = Record<HexagonalKey, boolean>; // 24 states
type RuneOrientationKey = 'ring' | 'star';
type RuneOrientationState = Record<RuneOrientationKey, RuneState>;
type RuneCouncillorKey = HexagonalKey | 'centre';
type RuneCouncillorState = Record<RuneCouncillorKey, RuneOrientationState>; // 24 * 7 = 168
type RunetatorState = { // 168 * 4 = 672
  circle: {
    outer: boolean;
    inner: boolean;
  };
  runes: RuneCouncillorState;
};
const hexagonalKeys = Array.from({ length: 6 }, (_, i) => i as HexagonalKey);
const orientationKeys: RuneOrientationKey[] = ['ring', 'star'];
const councillorKeys: RuneCouncillorKey[] = [...hexagonalKeys, 'centre'];

const getSeededStateHexagonal = <T,>(
  get: () => T
) => hexagonalKeys.reduce(
  (acc, key) => ({ ...acc, [key]: get() }),
  {} as Record<HexagonalKey, T>
);
const getSeededStateOrientation = (
  generate: () => boolean
) => {
  const generateRuneState = () => getSeededStateHexagonal(generate);
  return orientationKeys.reduce((acc, orientation) => {
    const runeState: RuneState = generateRuneState();
    return { ...acc, [orientation]: runeState };
  }, {} as RuneOrientationState);
};
const getRunetatorState = (
  generateBoolean: () => boolean,
): RunetatorState => {
  const getSeededCouncillorState = () => getSeededStateOrientation(generateBoolean);
  return {
    circle: {
      outer: generateBoolean(),
      inner: generateBoolean(),
    },
    runes: {
      centre: getSeededCouncillorState(),
      ...getSeededStateHexagonal(getSeededCouncillorState),
    },
  };
};
const getFullState = () => getRunetatorState(() => true);
const getSeededState = (seed: number): RunetatorState => {
  const generate = getGenerator(seed);
  const generateBool = () => generate() > 0.5;
  return getRunetatorState(generateBool);
};

const middleRadius = (GUIDES.outerRadius + GUIDES.innerRadius) / 2;
const middleMargin = GUIDES.outerRadius - GUIDES.innerRadius;

const getPathRunetator = ({
  circle: {
    outer,
    inner,
  },
  runes
}: RunetatorState, scale: number): string => {
  const runeSize = middleMargin * scale * 0.95;
  const scaleRune = scaleLine(runeSize);
  const outerMainPath = outer ? describeArc(0, 0, GUIDES.outerRadius * scale, 0, -0.01, { largeArc: true }) : '';
  const innerMainPath = inner ? describeArc(0, 0, GUIDES.innerRadius * scale, 0, -0.01, { largeArc: true }) : '';
  return councillorKeys.reduce((acc, councillorKey) => {
    const runeTranslation = councillorKey === 'centre'
      ? { x: 0, y: 0 } :
      polarToCartesian(0, 0, middleRadius * scale, councillorKey * 60);
    const runeOrientationState = runes[councillorKey];
    const runeLines = getInitialRuneLines();
    return orientationKeys.reduce((acc, orientation) => {
      const runeState = runeOrientationState[orientation];
      const runeOrientationLines = runeLines[orientation].map(scaleRune);
      return hexagonalKeys.reduce((acc, key) => {
        const state = runeState[key];
        if (state) {
          const line = translateLine(runeOrientationLines[key], runeTranslation);
          const path = mapLinePath(line);
          return `${acc} ${path}`;
        }
        return acc;
      }, acc);
    }, acc);
  }, [
    outerMainPath,
    innerMainPath,
  ].join(' '));
};

type RunetatorPropsBase = {
  color?: NeonPlasmaGlowConfigNames;
  flicker?: boolean; // Will cause changes in path segments to "flicker" in and out.
  fade?: boolean; // Will cause changes in path segments to fade in and out.
  runes?: Partial<Record<RuneCouncillorKey, Line[]>>;
} & (
  {
    fill: true;
  } | {
    state: RunetatorState;
  } | {
    seed: number;
  } | {
    seedStr: string;
  }
);
type RunetatorProps = RunetatorPropsBase & { size: SizeName; };

export const Runetator: React.FC<RunetatorProps> = ({
  flicker,
  ...props
}) => {
  const state = useMemo((): RunetatorState => {
    if ('fill' in props) return getFullState();
    if ('state' in props) return props.state;
    const seed = 'seed' in props ? props.seed : stringToSeed(props.seedStr);
    return getSeededState(seed);
  }, [flicker, props]);
  const scale = useMemo(() => SIZE_CONFIG[props.size], [props.size]);
  const d = useMemo(() => getPathRunetator(state, scale), [state, scale]);
  return <SvgNeonBlood color={'green'} {...props}>
    <path
      d={d}
      fill="none" 
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>;
};

const DemoRunetator: React.FC<RunetatorPropsBase> = (
  props
) => <GalleryItem>
  <Runetator size={'large'} {...props} />
  <div style={{ display: 'flex' }}>
    <Runetator size={'medium'} {...props} />
    <Runetator size={'small'} {...props} />
  </div>
</GalleryItem>;

const DemoRow: React.FC<RunetatorPropsBase & { label: string; }> = ({
  label, ...props
}) => {
  const { theme: { colors: { primary } } } = useTheme();
  return <>
    <Typography variant="h6" sx={{
      textShadow: `0 0 5px ${primary.main}`,
      color: primary.main,
      textTransform: 'uppercase',
    }}>{label}</Typography>
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {NEON_PLASMA_GLOW_CONFIG_NAMES.map((colour) => <DemoRunetator key={colour} color={colour} {...props} />)}
    </div>
  </>;
};

const useTicker = <T,>(cb: () => T, timeout: number, initialState?: T) => {
  const [state, setState] = useState<T | undefined>(initialState);

  const handleTimeout = useCallback(() => {
    setState(cb());
    return setTimeout(handleTimeout, timeout);
  }, [cb, setState, timeout]);

  useEffect(() => {
    const handle = handleTimeout();
    return () => {
      clearTimeout(handle);
    };
  }, []);

  return state;
};

export const RuneGenerator = () => {
  const { theme: { colors: { primary } } } = useTheme();
  const seed = useTicker(() => Date.now(), 1997);
  return (
    <>
      <Typography variant="h5" sx={{
        textShadow: `0 0 5px ${primary.main}`,
        color: primary.main,
        textTransform: 'uppercase',
      }}>Rune Tators</Typography>
      <DemoRow label="Filled" fill />
      <DemoRow label="Seeded" seed={seed || 0} />
      <DemoRow label="'Workflower'" seedStr={'Workflower'} />
    </>
  );
};
