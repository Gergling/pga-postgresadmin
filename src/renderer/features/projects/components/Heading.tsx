import { PropsWithChildren } from "react";
import { ParentheticalContainer, ParentheticalHeading } from "@/renderer/shared/brackets";
import { Grid } from "@mui/material";
import {
  COLORS
} from "@/renderer/shared/theme";
import { DoubleArrow } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { PROJECTS_BASE_ROUTE_ABSOLUTE } from "../constants";
import { ProjectStatus } from "./Status";
import { ProjectRenderer } from "@/shared/features/projects";

// export const ParentheticalHeadingBracketLine = styled.div<{}>`
//   ${fadingLine({ direction: 'left' })}
// `;



const Parenthetical = (
  props: Parameters<typeof ParentheticalContainer>[0]
) => <ParentheticalContainer roundness={0} style={{
  padding: '20px',
  textAlign: 'center',
}}>{props.children}</ParentheticalContainer>

const HeadingChip = ({ children }: PropsWithChildren) => <Grid
  flexBasis={0} flexGrow={1}
><ParentheticalHeading heading={children}></ParentheticalHeading></Grid>;

export const ProjectHeading = (project: ProjectRenderer) => {
  return <Parenthetical>
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, sm: 3 }}>
        <HeadingChip>
          <DoubleArrow sx={{ transform: 'rotate(180deg)' }} />
          <Link
            style={{
              color: COLORS.bloodGlow,
              margin: '0 0.5rem',
              textDecoration: 'none',
            }}
            to={PROJECTS_BASE_ROUTE_ABSOLUTE}
          >Project List</Link>
        </HeadingChip>
      </Grid>
      <Grid size={{ xs: 6, sm: 6 }}>
        <HeadingChip>{project.name}</HeadingChip>
      </Grid>
    </Grid>
    <ProjectStatus {...project} />
  </Parenthetical>
};
