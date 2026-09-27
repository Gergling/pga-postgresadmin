import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "../../svg-viewer/components";
import { AiOperationsList } from "./operations";
import { AiModelsList } from "./models";

export const AI_CHILD_ROUTES: UiNavigationConfigItem[] = [
  {
    label: 'Operations',
    path: '',
    icon: runeFactory('Operations'),
    element: AiOperationsList,
  },
  {
    label: 'Models',
    path: 'models',
    icon: runeFactory('models'),
    element: AiModelsList,
  },
];
