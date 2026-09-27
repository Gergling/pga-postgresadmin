import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "../../svg-viewer/components";
import { AiRoot } from "./Root";
import { AI_CHILD_ROUTES } from "./constants";

export const AI_ROUTES: UiNavigationConfigItem = {
  children: AI_CHILD_ROUTES,
  element: AiRoot,
  icon: runeFactory('AI'),
  label: 'AI',
  path: 'ai',
};
