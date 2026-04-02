import { Gallery, GalleryGroup, GalleryProps } from "./Gallery";
import { RuneGenerator } from "./RuneGenerator";
import {
  Architect,
  Diplomat,
  Guardian,
  Home,
  ImportantTasks,
  Librarian,
  Philosopher,
  Placeholder,
  ProposedTasks,
  QuickWins,
  Sceptic,
  Strategist,
  Workflower
} from "./svgs";
import { NeonBloodIcon } from "../config/neon";
import { Yield } from "./svgs/Yield";
import { FullDemoSigiliser } from "./Sigiliser";

const getGalleryConfig = <Name extends string,>(
  config: Record<GalleryGroup, Partial<Record<Name, NeonBloodIcon>>>,
) => (
  selected: Name,
): {
  items: GalleryProps<Name>;
  selected: Name;
} => ({
  items: Object.keys(config).reduce((acc, key) => ({
    ...acc,
    [key]: Object.keys(config[key as GalleryGroup]).reduce((acc, label) => [
      ...acc,
      {
        label,
        Component: config[key as GalleryGroup][label as Name],
      },
    ], []),
  }), {} as GalleryProps<Name>),
  selected: selected as Name,
});

const {
  items,
  selected,
} = getGalleryConfig({
  councillor: {
    'Philosopher': Philosopher,
    'Architect': Architect,
    'Diplomat': Diplomat,
    'Guardian': Guardian,
    'Librarian': Librarian,
    'Strategist': Strategist,
    'Sceptic': Sceptic,
  },
  navigation: {
    'Home': Home,
    'Tasks': Placeholder,
  },
  other: {
    'Importance': Placeholder,
    'Momentum': Placeholder,
    'Placeholder': Placeholder,
    'Workflower': Workflower,
    'Yield': Yield,
  },
  tasks: {
    'Important Tasks': ImportantTasks,
    'Proposed Tasks': ProposedTasks,
    'Quick Wins': QuickWins,
    'Tasks Awaiting Votes': Placeholder,
    'Tasks Width Abstentions': Placeholder,
  },
})('Yield');

export const SvgViewer = () => {
  return <div style={{ color: 'white' }}>
    <Gallery items={items} selected={selected} />

    <RuneGenerator/>
    <FullDemoSigiliser />
  </div>;
};


// IMPORTANCE
// A. Importance → The Anchor (Verticality)Importance is a "static" weight. It is the task's gravity.Concept: A single, sharp vertical spike with a horizontal "stop" at the top.Visual: Looks like a simplified version of your Important Tasks monolith, minus the crown.SVG Path: M50 20 L50 80 M30 20 L70 20 (A "T" shaped blade).Reasoning: Vertical lines feel heavy and "grounded."
// 2. The "Importance" Stake (The Weighted Spike)
// To answer your question: Yes, the bottom should come to a sharp point. Think of it as a "Stake" being driven into the registry—it is fixed, unmoving, and heavy.
// The Golden Top: A horizontal rectangular "Cap." This represents the "Head" of the stake where the weight is applied. To keep your 60-degree theme, we can "bevel" the corners of this rectangle at 60°.
// The Spike: A vertical pillar that terminates in a 60-degree triangular point at the bottom.
// The Logic: The "Cap" is the value (Gold), and the "Spike" is the anchor (Blood).
// SVG Path:
// Top Cap: M30 20 L70 20 L75 30 L25 30 Z (A beveled gold bar)
// Pillar: M45 30 V70 L50 85 L55 70 V30 Z (A sharp-pointed stake)


// MOMENTUM
// B. Momentum → The Vector (Velocity)Momentum is kinetic. It is the task's wind.Concept: Two parallel $60^\circ$ slashes that appear to be "cutting" forward.Visual: A distillation of your Strategist arrows.SVG Path: M30 80 L70 20 M50 80 L90 20 (Two leaning slashes).Reasoning: Diagonal lines at $60^\circ$ create an immediate sense of "forward lean" and speed.
// ... Maybe reconsider a lightening symbol.
// WHAT IF a lightening symbol being intersected by gaps.
// Could have three slanted sections stacked and skewed, the bottom one pointed. Could make it cyan since importance is red and gold anyway.


// OVERALL SCORE
// C. Potency (Overall) → The Singularity (Synthesis)
// This is the "Magic Circle" where the vertical (Importance) and the diagonal (Momentum) meet.
// Concept: A hexagon with a centered "dot" or a small star.
// Visual: A micro-version of the Workflower core.
// SVG Path: M50 30 L67 40 L67 60 L50 70 L33 60 L33 40 Z M50 45 L50 55 M45 50 L55 50
// Reasoning: Circular/Hexagonal shapes represent "Containment" and "Results." It looks like the "Target" of the triage process.

// 1. The "Potency" Sigil (The Ignited Monad)
// Using two circles and a flame moves the vibe from "Structure" to "Alchemy."
// The Geometry: Two concentric circles. The outer circle is a thin, steady "Neon Blood" ring. The inner circle is slightly thicker.
// The Flame: In the very center, instead of a realistic flame, we use three sharp, vertical strokes of varying heights (the "Triple Spark").
// The Logic: The circles represent the "Vessel" (Importance + Momentum), and the flame is the "Potency" being unleashed.
// SVG Path:
// Outer Circle: r="40" (Red)
// Inner Circle: r="25" (Red)
// Flame: Three vertical lines at the core (Gold).
// ... 

// Metric,Proposed Term,Symbolic Logic,Visual Direction
// Importance,Weight,Gravity / Anchor,Vertical Blade
// Momentum,Vigor,Velocity / Current,60∘ Slanted Slashes
// Overall,Potency,Resultant / Synthesis,Hexagonal Singularity





