import { Point } from "../types";

type ChainablePathProps = {
  points: Point[];
};

// const move = (props: ChainablePathProps) => () => {};
const chainable = (props: ChainablePathProps) => {
  return {
    toString: () => '',
  };
};

// type Point = { x: number; y: number };

export class VesselPath {
  private d: string[] = [];
  private current: Point = { x: 0, y: 0 };

  constructor(start?: Point) {
    if (start) this.move(start.x, start.y);
  }

  move(x: number, y: number) {
    this.d.push(`M ${x.toFixed(2)} ${y.toFixed(2)}`);
    this.current = { x, y };
    return this;
  }

  line(x: number, y: number) {
    this.d.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
    this.current = { x, y };
    return this;
  }

  // Standard Cubic Bezier (Absolute)
  curve(cp1: Point, cp2: Point, end: Point) {
    this.d.push(
      `C ${cp1.x.toFixed(2)} ${cp1.y.toFixed(2)}, ` +
      `${cp2.x.toFixed(2)} ${cp2.y.toFixed(2)}, ` +
      `${end.x.toFixed(2)} ${end.y.toFixed(2)}`
    );
    this.current = end;
    return this;
  }

  /**
   * Your Perpendicular Hypotenuse Logic
   * Creates an 'S' wave or a simple arc depending on the scalars.
   * @param end The destination point
   * @param s1 Scalar for cp1 (at 25%)
   * @param s2 Scalar for cp2 (at 75%)
   */
  waverTo(end: Point, s1: number, s2: number) {
    const start = this.current;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) return this;

    // Normal Vector (Perpendicular)
    const nx = -dy / dist;
    const ny = dx / dist;

    const cp1 = {
      x: start.x + dx * 0.25 + nx * s1,
      y: start.y + dy * 0.25 + ny * s1,
    };

    const cp2 = {
      x: start.x + dx * 0.75 + nx * s2,
      y: start.y + dy * 0.75 + ny * s2,
    };

    return this.curve(cp1, cp2, end);
  }

  close() {
    this.d.push('Z');
    return this;
  }

  build() {
    return this.d.join(' ');
  }
}
