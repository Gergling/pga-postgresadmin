import { Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import { ParentheticalContainer } from "@/renderer/shared/brackets";
import { ReleaseUpdate } from "@/renderer/features/release";

const Section = ({ children }: PropsWithChildren) => <ParentheticalContainer>
  {children}
</ParentheticalContainer>;

export const AdminRoot = () => {
  return <Stack spacing={2}>
    <Section><ReleaseUpdate /></Section>
  </Stack>;
};
