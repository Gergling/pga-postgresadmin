import { app } from "electron";
import { ANSI_COLOUR_MAP, log } from "../logging";
import { RunMode } from "@/shared/features/environment";

const getRunMode = (): RunMode => {
  if (process.env.ELECTRON_RENDERER_URL) return 'dev';
  if (app.isPackaged) return 'prod';
  return 'preview';
};

export const RUN_MODE = getRunMode();

const colour = ({
  dev: ANSI_COLOUR_MAP.cyan,
  preview: ANSI_COLOUR_MAP.purple,
  prod: ANSI_COLOUR_MAP.yellow,
})[RUN_MODE];

log(`${ANSI_COLOUR_MAP.white}Run mode is: ${colour}${RUN_MODE}${ANSI_COLOUR_MAP.reset}`)
