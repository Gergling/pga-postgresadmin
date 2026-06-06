import { create } from "zustand";
import { useProjectDetail } from "../context";
import { alpha, Badge } from "@mui/material";
import { ProjectRenderer } from "@/shared/features/projects";
import {
  ChatMessageProps,
  ChatOnSubmitFunction,
  ChatWindow,
} from "@/renderer/shared/common";
import { Button } from "@/renderer/shared/form";
import { ChatMessage, useCommitMessage } from "../hooks";
import { BugReport, Commit } from "@mui/icons-material";
import { COLORS, neonGlowStyle } from "@/renderer/shared/theme";

const store = create<{
  messages: ChatMessageProps[];
  addMessage: (message: ChatMessage) => void;
}>((set) => ({
  messages: [],
  addMessage: (message: ChatMessage) => set((state) => ({
    messages: [{
      timestamp: Date.now(),
      role: 'assistant',
      ...message,
    }, ...state.messages],
  })),
}));

const badgeStyle = neonGlowStyle({ color: COLORS.goldGlow });

const CommitMessagePresetButton = ({ project: { git }, onClick }: {
  project: ProjectRenderer; onClick: () => void;
}) => {
  if (typeof git !== 'object') return null;
  return <Button onClick={onClick} disabled={git.totalStagedFiles === 0}>
    <Badge badgeContent={git.totalStagedFiles} max={9} 
      sx={{
        "& .MuiBadge-badge": {
          ...badgeStyle,
          backgroundColor: alpha(COLORS.goldGlow, 0.6),
        }
      }}
    >
      <Commit />
    </Badge>
  </Button>;
};

export const ProjectDetailChat = () => {
  const { project } = useProjectDetail();
  const { addMessage, messages } = store();

  const handleSubmit: ChatOnSubmitFunction = ({ message }) => {
    addMessage(message);
  };

  const {
    commitChatActivity: chatActivity,
    // projectIsOutdated, // TODO: Use this to trigger refetch of project.
    proposeCommitMessage,
    // TODO: If we're using a store for this specific project across the detail
    // page (the broader feature) AND the commit message specifically, either we
    // need to pass the store here or use a provider. Given that we want to
    // declutter the component, we want a provider. Might be worth having an
    // additional provider for the chat window store.
    // setProjectHasUpdated, // Run this when refetching project.
  } = useCommitMessage(
    project,
    addMessage,
  );

  return <>
    <ChatWindow
      actions={<>
        <CommitMessagePresetButton
          project={project} onClick={proposeCommitMessage}
        />
        <Button disabled><BugReport /></Button>
      </>}
      messages={messages}
      onSubmit={handleSubmit}
      status={chatActivity}
      storageKey="projects"
    />
  </>;
};
