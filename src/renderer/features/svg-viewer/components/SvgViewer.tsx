import { Gallery } from "./Gallery";
import { RuneGenerator } from "./RuneGenerator";
import {
  Librarian,
  Placeholder,
  ProposedTasks,
  Sceptic
} from "./svgs";

const map = {
  'Librarian': Librarian,
  'Placeholder': Placeholder,
  'Proposed Tasks': ProposedTasks,
  'Sceptic': Sceptic,
};
type Key = keyof typeof map;
const selected: Key = 'Placeholder';

const items = Object.entries(map).map(([label, Component]) => ({ label, Component }));

export const SvgViewer = () => {
  return <div style={{ color: 'white' }}>
    <Gallery items={items} selected={selected} />

    Things to "rune": Home, Triple Root, Quick Tasks (some kinda rune rocket?), Abstained tasks can be an equals inside a hexagon, 

    <RuneGenerator/>
  </div>;
};