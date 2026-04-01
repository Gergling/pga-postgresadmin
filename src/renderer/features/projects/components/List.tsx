import { Card, CardContent, CardHeader } from "@/renderer/shared/card";
import { Grid, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/all";
import { Project } from "@shared/features/projects";
import { useMemo } from "react";
import { getProjectStatus } from "../utilities";
import { Temporal } from "@js-temporal/polyfill";
import { Typography } from "@/renderer/shared/theme";

const ProjectCard = (project: Project) => {
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

const RECENCY_GROUPS = [
  'today',
  'recent days',
  'recent weeks',
  'recent months',
  'this year', 'last year',
  'older',
] as const;

const NOT_SOURCE_CONTROLLED = 'not source-controlled';

type RecencyGroupName = typeof RECENCY_GROUPS[number];

type ProjectGroup = {
  projects: Project[];
  name: RecencyGroupName | typeof NOT_SOURCE_CONTROLLED;
};

type RecencyThresholds = {
  beginningLastYear: number;
  beginningThisYear: number;
  threeMonthsAgo: number;
  threeWeeksAgo: number;
  sevenDaysAgo: number;
  threeDaysAgo: number;
};

const getRecencyThresholds = (): RecencyThresholds => {
  const now = Temporal.Now.zonedDateTimeISO();
  const beginningLastYear = now.with({
    year: now.year - 1, month: 1, day: 1, hour: 0, minute: 0, second: 0
  }).epochMilliseconds;
  const beginningThisYear = now.with({
    year: now.year, month: 1, day: 1, hour: 0, minute: 0, second: 0
  }).epochMilliseconds;
  const threeMonthsAgo = now.subtract({ months: 3 }).epochMilliseconds;
  const threeWeeksAgo = now.subtract({ weeks: 3 }).epochMilliseconds;
  const sevenDaysAgo = now.subtract({ days: 7 }).epochMilliseconds;
  const threeDaysAgo = now.subtract({ days: 3 }).epochMilliseconds;
  return {
    beginningLastYear,
    beginningThisYear,
    threeMonthsAgo,
    threeWeeksAgo,
    sevenDaysAgo,
    threeDaysAgo,
  };
};

const getRecencyGroup = (
  milliseconds: number, {
    beginningLastYear,
    beginningThisYear,
    threeMonthsAgo,
    threeWeeksAgo,
    sevenDaysAgo,
  }: RecencyThresholds
): RecencyGroupName => {
  if (sevenDaysAgo < milliseconds) return 'recent days';
  if (threeWeeksAgo < milliseconds) return 'recent weeks';
  if (threeMonthsAgo < milliseconds) return 'recent months';
  if (beginningThisYear < milliseconds) return 'this year';
  if (beginningLastYear < milliseconds) return 'last year';
  return 'older';
};

export const ProjectsList = () => {
  const { projects } = useProjects();
  const groups = useMemo(() => {
    const thresholds = getRecencyThresholds();
    const map = (projects ?? []).reduce((map, project) => {
      const groupName = project.git
        ? getRecencyGroup(project.git.latestCommitDate, thresholds)
        : NOT_SOURCE_CONTROLLED
      ;
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
