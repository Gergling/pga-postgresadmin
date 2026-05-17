import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Stack } from "@mui/material";
import { ProjectRenderer } from "@/shared/features/projects";
import {
  getRecencyGroup,
  getRecencyThresholds,
  RECENCY_GROUPS,
  RecencyGroupName,
  RecencyThresholds
} from "@/shared/features/recency";
import { Card, CardContent, CardHeader } from "@/renderer/shared/card";
import { Typography } from "@/renderer/shared/theme";
import { useProjects } from "../hooks";
import { getProjectStatus } from "../utilities";

const ProjectCard = (project: ProjectRenderer) => {
  const { git, gitLatestCommitDate, local } = useMemo(
    () => getProjectStatus(project),
    [project]
  );
  const navigate = useNavigate();
  const handleProjectNavigation = (
    projectName: string
  ) => () => navigate(`/projects/${projectName}`);

  return <Grid size={{ xs: 12, md: 6 }}>
    <Card onClick={handleProjectNavigation(project.name)}>
      <CardHeader title={project.name} />
      <CardContent>
        <Grid container>
          <Grid size={{ xs: 4 }}>Local: {local}</Grid>
          <Grid size={{ xs: 4 }}>Git: {git}</Grid>
          {gitLatestCommitDate &&
            <Grid size={{ xs: 4 }}>Latest Commit: {gitLatestCommitDate}</Grid>
          }
        </Grid>
      </CardContent>
    </Card>
  </Grid>
};

const NOT_SOURCE_CONTROLLED = 'not source-controlled';
const getGroupNameFactory = (
  thresholds: RecencyThresholds
) => ({ git }: ProjectRenderer) => {
  if (typeof git !== 'object') return NOT_SOURCE_CONTROLLED;
  return getRecencyGroup(
    git.latestCommitDate.zonedDateTime.epochMilliseconds, thresholds
  );
};


type ProjectGroup = {
  projects: ProjectRenderer[];
  name: RecencyGroupName | typeof NOT_SOURCE_CONTROLLED;
};

export const ProjectsList = () => {
  const { projects } = useProjects();
  const groups = useMemo(() => {
    const thresholds = getRecencyThresholds();
    const getGroupName = getGroupNameFactory(thresholds);
    const map = (projects ?? []).reduce((map, project) => {
      const groupName = getGroupName(project);
      const group = map.get(groupName);
      const projects = group ? group.projects : [];
      return map.set(groupName, {
        name: groupName,
        projects: [...projects, project],
      });
    }, new Map<string, ProjectGroup>());
    return RECENCY_GROUPS
      .map((groupName) => map.get(groupName))
      .filter((group): group is ProjectGroup => group !== undefined
    );
  }, [projects]);

  return <>
    <div>Projects</div>
    <Stack spacing={2}>
      {groups.map(({ name, projects }) => (
        <Stack key={name}>
          <Typography variant="h6">{name}</Typography>
          <Grid container>
            {projects?.map(project => <ProjectCard key={project.name} {...project}/>)}
          </Grid>
        </Stack>
      ))}
    </Stack>
  </>;
};
