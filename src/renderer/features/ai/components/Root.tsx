import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import { ParentheticalContainer } from "@/renderer/shared/brackets";

const Section = ({ children }: PropsWithChildren) => <ParentheticalContainer >
  {children}
</ParentheticalContainer>;

export const AiRoot = () => {
  return <Stack spacing={2}>
    <Section></Section>
  </Stack>;
};
