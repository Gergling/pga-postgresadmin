import { ParentheticalContainer } from "@/renderer/shared/brackets";
import {
  ChatMessageProps,
  ChatOnSubmitFunction,
  ChatWindow
} from "@/renderer/shared/common/components/Chat";
import { HorizontalLine } from "@/renderer/shared/common/components/HorizontalLine.style";
import { Button } from "@/renderer/shared/form";
import { useIpc } from "@/renderer/shared/ipc";
import { COLORS, Typography } from "@/renderer/shared/theme";
import { Grid, Paper, Stack } from "@mui/material";
import { Project } from "@shared/features/projects";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { getProjectHistoryItem, getProjectStatus } from "../utilities";
import { Link } from "react-router-dom";
import { PROJECTS_BASE_ROUTE_ABSOLUTE } from "../constants";
import { useNavigationRegister } from "@/renderer/shared/navigation";
import { DoubleArrow } from "@mui/icons-material";

const Parenthetical = (
  props: Parameters<typeof ParentheticalContainer>[0]
) => <ParentheticalContainer roundness={0} style={{
  padding: '20px',
  textAlign: 'center',
}}>{props.children}</ParentheticalContainer>

const HeadingChip = ({ children }: PropsWithChildren) => <Grid
  flexBasis={0} flexGrow={1}
><Typography variant="body1">{children}</Typography></Grid>;

const InfoChip = (props: {
  label: React.ReactNode;
  value: React.ReactNode;
}) => <Stack style={{ flexBasis: 0, flexGrow: 1 }}>
  <Typography variant="h6">{props.label}</Typography>
  <HorizontalLine />
  <Typography variant="body1">{props.value}</Typography>
</Stack>

export const ProjectDetail = (project: Project) => {
  const status = useMemo(() => getProjectStatus(project), [project]);
  const { register } = useNavigationRegister();

  const [
    enableFetchCommitMessage, setEnableFetchCommitMessage
  ] = useState(false);
  const {
    commitProjectStagedFiles,
    fetchProjectStagedCommitMessage
  } = useIpc();
  const { data: stagedCommitMessage } = useQuery({
    enabled: enableFetchCommitMessage,
    queryKey: ['project', project.name],
    queryFn: () => project ? fetchProjectStagedCommitMessage(project) : undefined,
  });
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);

  const handleSubmit: ChatOnSubmitFunction = ({ messages }) => {
    setMessages(messages);
  };

  const handleGenerateCommitMessage = () => {
    setEnableFetchCommitMessage(true);
  };

  const handleCommitStagedFiles = (message: string) => async () => {
    const { stderr, stdout } = await commitProjectStagedFiles(project, message);
    const stdoutMessage = {
      content: <>Commit generated this std output: <Paper>{stdout}</Paper></>,
      role: 'assistant',
      timestamp: Date.now(),
    };
    if (stderr) {
      // TODO: Full error message can unfold in a collapsible or accordion or
      // whatever.
      setMessages((prev) => [
        {
          content: <>An error occurred while committing:</>,
          role: 'assistant',
          timestamp: Date.now()
        },
        stdoutMessage,
        ...prev,
      ]);
    }

    // TODO: Refetch the staged files for this project.
    setMessages((prev) => [
      stdoutMessage,
      ...prev,
    ]);

  };

  useEffect(() => {
    if (enableFetchCommitMessage && stagedCommitMessage) {
      setEnableFetchCommitMessage(false);
      setMessages((prev) => [
        {
          actions: <>
            <Button onClick={handleCommitStagedFiles(stagedCommitMessage)}>
              Commit
            </Button>
          </>,
          content: <>
            Commit message for staged files in project "{project.name}":
            <Paper>{stagedCommitMessage}</Paper>
          </>,
          role: 'assistant',
          timestamp: Date.now()
        },
        ...prev,
      ]);
    }
  }, [enableFetchCommitMessage, stagedCommitMessage]);

  console.log(messages, stagedCommitMessage)

  useEffect(() => {
    register(getProjectHistoryItem(project));
  }, [project]);

  // TODO: Need to show the *next* unit test source code to be built against.
  // Ideally provide a facility to generate unit tests against specific source
  // files as well.

  return <>
    <Parenthetical>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 4 }}>
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
        <Grid size={{ xs: 6, sm: 4 }}>
          <HeadingChip>{project.name}</HeadingChip>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <InfoChip label="Local" value={status.local} />
        <InfoChip label="Git" value={status.git} />
        <InfoChip label="Unit Tests Installed" value="Unknown" />
      </Grid>
    </Parenthetical>
    <ChatWindow
      actions={<>
        <Button onClick={handleGenerateCommitMessage}>
          Generate Commit Message
        </Button>
        <Button>Generate Unit Test</Button>
      </>}
      messages={messages}
      onSubmit={handleSubmit}
      storageKey="projects"
    />
  </>
};
