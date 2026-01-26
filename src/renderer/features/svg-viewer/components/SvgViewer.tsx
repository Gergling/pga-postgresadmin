import { Gallery } from "./Gallery";
import { RuneGenerator } from "./RuneGenerator";
import {
  Architect,
  Diplomat,
  Guardian,
  Home,
  ImportantTasks,
  Librarian,
  Placeholder,
  ProposedTasks,
  Sceptic
} from "./svgs";

const map = {
  'Architect': Architect,
  'Diplomat': Diplomat,
  'Guardian': Guardian,
  'Home': Home,
  'Important Tasks': ImportantTasks,
  'Librarian': Librarian,
  'Philosopher': Placeholder,
  'Placeholder': Placeholder,
  'Proposed Tasks': ProposedTasks,
  'Quick Wins': Placeholder,
  'Sceptic': Sceptic,
  'Strategist': Placeholder,
  'Tasks Awaiting Votes': Placeholder,
  'Tasks Width Abstentions': Placeholder,
  'Workflower': Placeholder,
};
type Key = keyof typeof map;
const selected: Key = 'Important Tasks';

const items = Object.entries(map).map(([label, Component]) => ({ label, Component }));

export const SvgViewer = () => {
  return <div style={{ color: 'white' }}>
    <Gallery items={items} selected={selected} />

    <RuneGenerator/>
  </div>;
};