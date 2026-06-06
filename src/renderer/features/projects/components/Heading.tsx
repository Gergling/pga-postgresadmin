import { PropsWithChildren } from "react";
import { Grid } from "@mui/material";
import { DoubleArrow } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ProjectRenderer } from "@/shared/features/projects";
import {
  ParentheticalHeading
} from "@/renderer/shared/brackets";
import {
  COLORS
} from "@/renderer/shared/theme";
import { PROJECTS_BASE_ROUTE_ABSOLUTE } from "../constants";

const HeadingChip = ({ children }: PropsWithChildren) => <Grid
  flexBasis={0} flexGrow={1}
><ParentheticalHeading heading={children}></ParentheticalHeading></Grid>;

export const ProjectHeading = (project: ProjectRenderer) => {
  return <Grid container spacing={2}>
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
  </Grid>;
};
