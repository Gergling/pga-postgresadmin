import {
  ConfigParams,
  configParamsSchema,
} from "../schemas";

export const createQualityReportConfig = (
  props: ConfigParams
) => configParamsSchema.parse(props);
