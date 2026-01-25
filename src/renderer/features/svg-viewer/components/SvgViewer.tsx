import { Gallery } from "./Gallery";
import { RuneGenerator } from "./RuneGenerator";
import {
  Architect,
  Librarian,
  Placeholder,
  ProposedTasks,
  Sceptic
} from "./svgs";

const map = {
  'Architect': Architect,
  'Diplomat': Placeholder,
  'Guardian': Placeholder,
  'Home': Placeholder,
  'Important Tasks': Placeholder,
  'Librarian': Librarian,
  'Philosopher': Placeholder,
  'Placeholder': Placeholder,
  'Proposed Tasks': ProposedTasks,
  'Quick Wins': Placeholder,
  'Sceptic': Sceptic,
  'Strategist': Placeholder,
  'Tasks Awaiting Votes': Placeholder,
  'Tasks Width Abstentions': Placeholder,
};
type Key = keyof typeof map;
const selected: Key = 'Architect';

const items = Object.entries(map).map(([label, Component]) => ({ label, Component }));

export const SvgViewer = () => {
  return <div style={{ color: 'white' }}>
    <Gallery items={items} selected={selected} />

    Things to "rune": Home, Triple Root, Quick Tasks (some kinda rune rocket?), Abstained tasks can be an equals inside a hexagon, 

    <RuneGenerator/>
  </div>;
};