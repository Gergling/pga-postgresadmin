import { orchestrate } from "./orchestrate";
import { getCommandFromArgs } from "./utilities";

const cmd = getCommandFromArgs();

orchestrate(cmd);
