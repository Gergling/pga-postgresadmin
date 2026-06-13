import { Task } from "tasuku";
import { SetAnalysis } from "./utilities";

export type ConfigFnc = (props: {
  setAnalysis: SetAnalysis, task: Task
}) => void;

export type Config = ConfigFnc[];
