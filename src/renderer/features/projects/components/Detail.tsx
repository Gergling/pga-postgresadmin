import { useEffect } from "react";
import {
  ChatMessageProps,
  ChatOnSubmitFunction,
  ChatWindow
} from "@/renderer/shared/common";
import { Button } from "@/renderer/shared/form";
import { ProjectRenderer } from "@/shared/features/projects";
import { useNavigationRegister } from "@/renderer/shared/navigation";
import { getProjectHistoryItem } from "../utilities";
import { ProjectHeading } from "./Heading";
import { ChatMessage, useCommitMessage } from "../hooks";
import { create } from "zustand";

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

export const ProjectDetail = (project: ProjectRenderer) => {
  const { register } = useNavigationRegister();
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

  useEffect(() => {
    register(getProjectHistoryItem(project));
  }, [project]);

  // TODO: Need to show the *next* unit test source code to be built against.
  // Ideally provide a facility to generate unit tests against specific source
  // files as well.

  return <>
    <ProjectHeading {...project} />
    <ChatWindow
      actions={<>
        <Button onClick={proposeCommitMessage}>
          Generate Commit Message
        </Button>
        <Button>Generate Unit Test</Button>
      </>}
      messages={messages}
      onSubmit={handleSubmit}
      status={chatActivity}
      storageKey="projects"
    />
  </>
};
