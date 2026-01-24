import { Gallery } from "./Gallery";
import { RuneGenerator } from "./RuneGenerator";

export const SvgViewer = () => {
  return <div style={{ color: 'white' }}>
    <Gallery label="Sceptic" />

    Things to "rune": Home, Triple Root, Quick Tasks (some kinda rune rocket?), Abstained tasks can be an equals inside a hexagon, 

    <RuneGenerator/>
  </div>;
};