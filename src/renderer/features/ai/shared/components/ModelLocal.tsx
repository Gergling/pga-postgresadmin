import { COLORS } from "@/renderer/shared/theme";
import { Cloud, Laptop } from "@mui/icons-material";

export const ModelLocal = (
  { local }: { local: boolean; }
) => local ? <Laptop htmlColor={'#0ff'} /> : <Cloud htmlColor={COLORS.goldGlow} />;