import { Gallery } from "./Gallery";
import { RuneGenerator } from "./RuneGenerator";
import {
  Librarian,
  ProposedTasks,
  Sceptic
} from "./svgs";

const items = Object.entries({
  'Librarian': Librarian,
  'Proposed Tasks': ProposedTasks,
  'Sceptic': Sceptic,
}).map(([label, Component]) => ({ label, Component }));


export const SvgViewer = () => {
  return <div style={{ color: 'white' }}>
    <Gallery items={items} selected="Librarian" />

    Things to "rune": Home, Triple Root, Quick Tasks (some kinda rune rocket?), Abstained tasks can be an equals inside a hexagon, 

    <RuneGenerator/>
  </div>;
};