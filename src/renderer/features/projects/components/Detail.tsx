import { ParentheticalContainer } from "@/renderer/shared/brackets";
import {
  ChatMessageProps,
  ChatOnSubmitFunction,
  ChatWindow
} from "@/renderer/shared/common/components/Chat";
import { HorizontalLine } from "@/renderer/shared/common/components/HorizontalLine.style";
import { Button } from "@/renderer/shared/form";
import { useIpc } from "@/renderer/shared/ipc";
import { Typography } from "@/renderer/shared/theme";
import { Grid, Link, Paper, Stack } from "@mui/material";
import { Project } from "@shared/features/projects";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { getProjectStatus } from "../utilities";

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

  const [enableFetchCommitMessage, setEnableFetchCommitMessage] = useState(false);
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

  useEffect(() => {
    if (enableFetchCommitMessage && stagedCommitMessage) {
      setEnableFetchCommitMessage(false);
      setMessages((prev) => [
        {
          actions: <>
            <Button onClick={() => commitProjectStagedFiles(
              project,
              stagedCommitMessage
            )}>Commit</Button>
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
  }, [enableFetchCommitMessage]);

  // TODO: So now we can write up the IPC and main for checking for git against
  // the project and running the commit message generator. This will simply
  // return a commit message, which will go into the chat message. It will
  // include a button for running a separate operation which runs the commit.

  return <>
    <Parenthetical>
      <Grid container spacing={2}>
        <HeadingChip><Link href="/projects">Project List</Link></HeadingChip>
        <HeadingChip>{project.name}</HeadingChip>
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
