import { GUIDES } from "../config";
import { PathFunction, Point } from "../types";
import { deltaPoint, describeArc, polarToCartesian, scalePoint, translatePoint } from "../utilities";
import { arcPath } from "./arc";
import { getPathMagicCircle } from "./magic-circle";

// Can have a round bottom

const markFactory = (scale: number) => (p: Point) => describeArc(p.x, p.y, 0.01 * scale, 0, -0.01, { largeArc: true });

export const generateWavyFlame = (
  size: number,
  limitScale: number
): string => {
  console.log('size 1', size)
  console.log('scale 1', limitScale)
  const pad = size * (1 - limitScale);
  const min = pad;
  const max = size - pad;
  const center = size / 2;

  // Key Coordinates
  const base: Point = { x: center, y: max };
  const tip: Point = { x: center, y: min };

  /**
   * Side A (Leftward Waver)
   * cp1: Pulls the base slightly left
   * cp2: Pulls the tip slightly right to create the 'S' wave
   */
  const sideA = {
    cp1: { x: center - (size * 0.2), y: max - (size * 0.2) },
    cp2: { x: center + (size * 0.2), y: min + (size * 0.3) },
  };
  console.log('sideA 1', sideA)
  console.log('base 1', base)
  console.log('tip 1', tip)

  /**
   * Side B (Rightward Snap)
   * cp1: Pulls the tip down and left to sharpen the cusp
   * cp2: Pulls the base from the right
   */
  const sideB = {
    cp1: { x: center - (size * 0.1), y: min + (size * 0.3) },
    cp2: { x: center + (size * 0.1), y: max - (size * 0.2) },
  };

  return `
    M ${base.x} ${base.y}
    C ${sideA.cp1.x} ${sideA.cp1.y}, ${sideA.cp2.x} ${sideA.cp2.y}, ${tip.x} ${tip.y}
    // C ${sideB.cp1.x} ${sideB.cp1.y}, ${sideB.cp2.x} ${sideB.cp2.y}, ${base.x} ${base.y}
  `.replace(/\s+/g, ' ').trim();
};

export const generateWavyFlame2 = (
  tip: Point,
  base: Point,
  // size: number,
  scale = 0.95
): string => {
  const delta = deltaPoint(base, tip);
  const centrePoint = translatePoint(delta, base)
  const size = Math.hypot(delta.x, delta.y);
  console.log('size 2', size)
  console.log('scale 2', scale)
  const pad = size * (1 - scale);
  const min = pad + centrePoint.y;
  const max = size - pad;
  const center = size / 2;

  // Key Coordinates
  // const base: Point = { x: center, y: max };
  // const tip: Point = { x: center, y: min };

  /**
   * Side A (Leftward Waver)
   * cp1: Pulls the base slightly left
   * cp2: Pulls the tip slightly right to create the 'S' wave
   */
  const sideA = {
    cp1: { x: centrePoint.x - (size * 0.2), y: max - (size * 0.2) },
    cp2: { x: centrePoint.x + (size * 0.2), y: min + (size * 0.3) },
  };
  console.log('sideA 2', sideA)
  console.log('base 2', base)
  console.log('tip 2', tip)


  /**
   * Side B (Rightward Snap)
   * cp1: Pulls the tip down and left to sharpen the cusp
   * cp2: Pulls the base from the right
   */
  const sideB = {
    cp1: { x: center - (size * 0.1), y: min + (size * 0.3) },
    cp2: { x: center + (size * 0.1), y: max - (size * 0.2) },
  };

  return [
    `M ${base.x} ${base.y}`,
    `C ${sideA.cp1.x} ${sideA.cp1.y}, ${sideA.cp2.x} ${sideA.cp2.y}, ${tip.x} ${tip.y}`,
    // `C ${sideB.cp1.x} ${sideB.cp1.y}, ${sideB.cp2.x} ${sideB.cp2.y}, ${base.x} ${base.y}`,
  ].join(' ').replace(/\s+/g, ' ').trim();
};

const getFlameCurvePoints = (
  start: Point,
  end: Point,
  scale: number,
) => {
  const delta = deltaPoint(start, end);

  const [
    s, d, e, john, jeff,
  ] = [
    start,
    scalePoint(delta, 0.5),
    // scalePoint(delta, 0.75),
    delta,
    scalePoint(delta, 0.75),
    scalePoint(delta, 0.25), 
    // scalePoint(delta, 0.375),
  ].map((point) => scalePoint(point, scale / 2));
  // console.log(start, d1, d2, dEnd)
  // return `c ${d1.y} ${-d1.x}, ${d2.y} ${-d2.x}, ${dEnd.x} ${dEnd.y}`;
  const d1r = { x: d.y - d.x, y: d.x + d.y };
  const d2r = { x: jeff.y - jeff.x, y: jeff.x + jeff.y };
  const d3r = { x: john.x - john.y, y: john.x + john.y };
  console.log(scale, s, d, e)
  return [
    `M ${start.x} ${start.y}`,
    // mark(s, scale),
    // mark(d1r, scale),
    // mark(d2r, scale),
    // mark(john, scale),
    // mark(d, scale),
    // mark(e, scale),
    // `M ${s.x} ${s.y}`,
    `c ${d2r.x} ${d2r.y},`,
    `${d3r.x} ${d3r.y},`,
    `${e.x} ${e.y}`,
    // `q ${d1r.x} ${d1r.y}, ${e.x} ${e.y}`,
    // `s ${d2r.x} ${d2r.y}, ${john.x} ${john.y}`,
    // mark(scalePoint(delta, 1.25), scale),
    // mark(scalePoint(delta, 2.5), scale),
    // mark(scalePoint(delta, 3.25), scale),
    // mark(scalePoint(delta, scale * 0.25), scale),
    // mark(scalePoint(delta, 7.5), scale),
    // mark(scalePoint(delta, 10), scale),
    // mark(scalePoint(delta, 0.75), scale),
  ].join(' ');
};

const getRelativeCubicPoints = (start: Point, end: Point, t: number, scalar: number) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // The Normal Vector (Perpendicular)
  // Rotating the direction vector (dx, dy) by 90 degrees
  const nx = dy / dist; 
  const ny = -dx / dist;
  // const nx = -dy / dist; 
  // const ny = dx / dist;

  // The point along the hypotenuse at percentage 't'
  const tx = dx * t;
  const ty = dy * t;

  console.log('d', dx, dy, dist)
  console.log('n', nx, ny)
  console.log('t', tx, ty, t)

  // The final relative offset including the perpendicular scalar
  return {
    x: tx + nx * scalar,
    y: ty + ny * scalar
  };
};

export const getPathFire: PathFunction = (scale) => {
  // describeArc(0, 0, GUIDES.outerRadius * scale, 0, -0.01)
  // const flame = getFlameCurvePoints({ x: -0.1, y: 0 }, { x: 0, y: -0.3 }, scale);
  // const flame = getFlamePath({ x: -0.1, y: 0 }, { x: 0, y: -0.3 }, { x: 0.1, y: 0 }, scale * GUIDES.innerRadius);

  const unscaled = {
    bl: { x: -0.3, y: 0 },
    br: { x: -0.2, y: 0 },
    tip: { x: -0.25, y: -0.45 },
  };
  const [bl, br, tip] = [
    { x: -0.3, y: 0 },
    { x: -0.2, y: 0 },
    { x: -0.25, y: -0.45 }
  ].map((p) => scalePoint(p, scale));

  const [d1, d2, de] = [
    { x: -0.2, y: -0.15 },
    { x: 0.2, y: -0.25 },
    { x: 0, y: -0.45 }, // This *should* just be the delta.
  ].map((p) => scalePoint(p, scale));
  const deltal = deltaPoint(bl, tip);
  const distl = deltal.hypotenuse;
  const deltar = deltaPoint(br, tip);
  const [nl1, nl2] = [
    scalePoint({ x: -deltal.y / distl, y: deltal.x / distl }, 1/scale),
    { x: 0.2, y: -0.25 },
  ].map((p) => scalePoint(p, scale));
  const [tl1, tl2] = [
    scalePoint(deltal, 0.33/scale), // dx * t
    // scalePoint(nl1, 0.25/scale),
    { x: 0.2, y: -0.25 },
  ].map((p) => scalePoint(p, scale));
  const [d1l, d2l] = [
    { x: -deltal.y / distl, y: deltal.x / distl },
    { x: 0.2, y: -0.25 },
  ].map((p) => scalePoint(p, scale));
  const ntl = translatePoint(nl1, tl1);
  console.log('inputs (bottom, tip, 33%, scale)', unscaled.bl, unscaled.tip, 0.33, scale)
  const rel = getRelativeCubicPoints(unscaled.bl, unscaled.tip, 0.33, 1);
  const relScaled = scalePoint(rel, scale);

  console.log('outputs (comparative: rel, d1, nl1, tl1)', rel, d1, nl1, tl1)

  const mark = (p: Point) => markFactory(scale)(translatePoint(p, bl));

  return [
    // `M ${bl.x} ${bl.y}`,
    // `c ${d1.x} ${d1.y}, ${d2.x} ${d2.y}, ${deltal.x} ${deltal.y}`,
    // `M ${br.x} ${br.y}`,
    // `c ${d1.x} ${d1.y}, ${d2.x} ${d2.y}, ${deltar.x} ${deltar.y}`,
    // ^^^ This does what I want, but I want the control points to be calculated from the start and end.
    `M ${bl.x} ${bl.y}`,
    `c ${relScaled.x} ${relScaled.y}, ${d2.x} ${d2.y}, ${deltal.x} ${deltal.y}`,
    `M ${br.x} ${br.y}`,
    `c ${d1.x} ${d1.y}, ${d2.x} ${d2.y}, ${deltar.x} ${deltar.y}`,

    mark(d1), // What we want
    mark(relScaled), // Gemini version
    mark(tl1), // Dev
    'M 0 0',
    // getFlameCurvePoints({ x: -0.3, y: 0.45 }, { x: -0.25, y: -0 }, scale),
    // getFlameCurvePoints({ x: -0.2, y: 0.45 }, { x: -0.25, y: -0 }, scale),
    // getFlameCurvePoints({ x: -0.1, y: 0 }, { x: 0, y: -0.45 }, scale),
    // getFlameCurvePoints({ x: -0, y: 0 }, { x: 0, y: -0.45 }, scale),
    // getFlameCurvePoints({ x: -0, y: 0 }, { x: 0, y: -0.45 }, scale),
    // generateWavyFlame2(tip, bl, 0.95),
    // generateWavyFlame(GUIDES.outerRadius * scale, 0.95),
  ].join(' ');
};
