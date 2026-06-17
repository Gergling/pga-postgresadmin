import { Task } from "tasuku";
import { SetAnalysis } from "./utilities";
import { QualityReport } from "./schemas";

export type ConfigFnc = (props: {
  setAnalysis: SetAnalysis, task: Task
}) => void;

export type Config = ConfigFnc[];

export type Transformer = (report: QualityReport) => QualityReport;
