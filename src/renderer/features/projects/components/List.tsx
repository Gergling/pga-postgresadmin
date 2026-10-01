import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Stack } from "@mui/material";
import { EnrichedProject } from "@/shared/features/projects";
import {
  getRecencyGroup,
  getRecencyThresholds,
  RECENCY_GROUPS,
  RecencyGroupName,
  RecencyThresholds
} from "@/shared/features/recency";
import { Card, CardContent, CardHeader } from "@/renderer/shared/card";
import { Typography } from "@/renderer/shared/theme";
import { ParentheticalContainer } from "@/renderer/shared/brackets";
import { Slab } from "@/renderer/shared/base";
import { useProjects } from "../hooks";
import { getProjectStatus } from "../utilities";

const ProjectCard = (project: EnrichedProject) => {
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
) => ({ git }: EnrichedProject) => {
  if (typeof git !== 'object') return NOT_SOURCE_CONTROLLED;
  return getRecencyGroup(
    git.latestCommitDate.epochMilliseconds, thresholds
  );
};


type ProjectGroup = {
  projects: EnrichedProject[];
  name: RecencyGroupName | typeof NOT_SOURCE_CONTROLLED;
};

export const ProjectsList = () => {
  const { projects, updateRoot, isLoading } = useProjects();
  const groups = useMemo(() => {
    const thresholds = getRecencyThresholds();
    const getGroupName = getGroupNameFactory(thresholds);
    const map = (projects ?? []).reduce((map, envelope) => {
      const project = envelope.enrichedProject.data;
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

  // useeffect the updateRoot call
  // it should be wrapped in a function which makes state updates when done
  // then we have to invalidate the projects call
  useEffect(() => {
    updateRoot();
  }, []);

  return <>
    <Slab scanLines={isLoading ? 'scroll' : 'static'}>
      <Stack spacing={2}>
        <ParentheticalContainer roundness={0} style={{ padding: '1rem' }}>
          <Typography
            variant="h6"
            textAlign={'center'}
          >Projects</Typography>
        </ParentheticalContainer>
        {groups.length === 0 &&
          <ParentheticalContainer roundness={0} style={{ padding: '1rem' }}>
            <Typography
              variant="body1"
              textAlign={'center'}
            >
              No projects to display
            </Typography>
          </ParentheticalContainer>
        }
        {groups.map(({ name, projects }) => (
          <Stack key={name}>
            <Typography variant="h6">{name}</Typography>
            <Grid container>
              {projects?.map(project => <ProjectCard key={project.name} {...project} />)}
            </Grid>
          </Stack>
        ))}
      </Stack>
    </Slab>
  </>;
};
