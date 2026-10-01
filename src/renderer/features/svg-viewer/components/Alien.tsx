import { stringToSeed } from "@/shared/utilities";
import { useMemo } from "react";
import { SvgNeonBlood } from "./themes";
import { describeArc } from "../utilities";
import { SIZE_CONFIG, SizeName } from "../config/neon";

const sizeName = 'large';
const size = SIZE_CONFIG[sizeName];

type Vertex = {
  x: number;
  y: number;
  state: 'off' | 'empty' | 'filled';
  // primary?: 'c' | 't' | 'tr' | 'br' | 'b' | 'bl' | 'tl';
  code: string;
};

type Connection = {
  // There are always exactly two.
  vertices: [Vertex, Vertex];
  state: boolean;
};

const getCode = (x: number, y: number): string => {
  if (x === 0 && y === 0) return 'c';

  const isTop = y < 0;
  const isLeft = x < 0;
  const isRight = x > 0;

  if (isTop) {
    const prepend = 't';
    if (isLeft) return `${prepend}l`;
    if (isRight) return `${prepend}r`;
    return prepend;
  }

  const prepend = 'b';
  if (isLeft) return `${prepend}l`;
  if (isRight) return `${prepend}r`;
  return prepend;
};

const getPrimaryVertices = (radius: number): Vertex[] => {
  const points = 6;
  const hexPie = Math.PI * 2 / points;
  return Array.from({ length: points }, (_, i) => {
    const angle = i * hexPie;
    const x = radius * Math.sin(angle);
    const y = radius * Math.cos(angle);
    return {
      code: getCode(x, y),
      state: 'off',
      x,
      y,
    };
  });
};

// Rules:
// Every vertex in a connection has a state of either empty or filled.

const alienFactory = () => {
  const points = 6;
  const hexPie = Math.PI * 2 / points;
  const radius = size * 0.9 / 2;
  const vertices = Array.from({ length: points }, (_, i) => {
    const angle = i * hexPie;
    return {
      x: radius * Math.sin(angle),
      y: radius * Math.cos(angle),
    };
  });
  const primaryVertices = Array.from({ length: points }, (_, i) => {
    const angle = i * hexPie;
    return {
      x: radius * Math.sin(angle),
      y: radius * Math.cos(angle),
    };
  });
  const circles = vertices.map(
    ({ x, y }) => `${describeArc(x, y, radius * 0.1, 0, 359, { largeArc: true })}`
  )
  const d = circles.join(' ');
  return d;
};

const d = alienFactory();

// const d = vertices.map(
//   ({x, y}) => `${x} ${y}`
// ).join(' ');

// const d = [
//   ''
// ].join(' ');

export const Alien = ({ str }: { str: string; }) => {
  const seed = useMemo(() => stringToSeed(str), [str]);
  // const d = useMemo(() => getPathRunetator(state, scale), [state, scale]);
  return <SvgNeonBlood size={sizeName} color={'gold'}>
    <path
      d={d}
      fill="none"
      strokeLinejoin="bevel"
    />
  </SvgNeonBlood>
};
