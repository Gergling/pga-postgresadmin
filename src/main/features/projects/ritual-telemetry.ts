import { Project } from "@shared/features/projects";
import { handleRitualTelemetry, HandleRitualTelemetryProps } from "../ai";
import {
  RitualTelemetrySubscriptionParamsProjectProps
} from "@shared/features/ai";

export const handleProjectRitualTelemetry = async <Returns extends Promise<unknown>>(
  project: Project,
  operation: RitualTelemetrySubscriptionParamsProjectProps['operation'],
  props: HandleRitualTelemetryProps<Returns>,
) => handleRitualTelemetry({
  ...props,
  project: {
    name: project.name,
    operation,
  }
});
