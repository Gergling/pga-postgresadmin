import { Task } from "tasuku";
import { DeepPartialQualityReport } from "./schema";

export type ConfigFnc = (props: { task: Task }) => DeepPartialQualityReport;

export type Config = ConfigFnc[];
