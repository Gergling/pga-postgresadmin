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
  Strategist
} from "./svgs";
import { NeonBloodIcon } from "../config/neon";

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
  },
  other: {
    'Placeholder': Placeholder,
    'Workflower': Placeholder,
  },
  tasks: {
    'Important Tasks': ImportantTasks,
    'Proposed Tasks': ProposedTasks,
    'Quick Wins': QuickWins,
    'Tasks Awaiting Votes': Placeholder,
    'Tasks Width Abstentions': Placeholder,
  },
})('Strategist');

export const SvgViewer = () => {
  return <div style={{ color: 'white' }}>
    <Gallery items={items} selected={selected} />

    <RuneGenerator/>
  </div>;
};