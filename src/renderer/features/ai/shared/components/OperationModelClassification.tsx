import { COLORS, neonGlowStyle, Typography } from "@/renderer/shared/theme";
import { LlmHistoryClassification } from "@/shared/features/llm";

export const OperationModelClassification = (
  { classification }: { classification: LlmHistoryClassification; }
) => <Typography
  variant="body1" style={{
    color: COLORS.goldGlow,
    ...neonGlowStyle({
      color: COLORS.goldGlow,
      shadow: { box: false, text: true }
    }),
  }}
>{classification.toUpperCase()}</Typography>;
