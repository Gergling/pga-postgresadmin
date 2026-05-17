import { createElement, useCallback, useEffect, useMemo } from "react";
import { skipToken } from "@tanstack/react-query";
import { Optional } from "@/shared/types";
import { projectCodec, ProjectRenderer } from "@/shared/features/projects";
import { ChatMessageProps } from "@/renderer/shared/common";
import { trpcReact } from "@/renderer/libs/react-query";
import {
  ProjectCommitButton,
  ProjectFormattedCommitMessage
} from "../components";
import { commitMessageStore } from "../stores";

export type ChatMessage = Optional<ChatMessageProps, 'role' | 'timestamp'>;

export const useCommitMessage = (
  project: ProjectRenderer,
  // messages: ChatMessage[],
  pushMessage: (message: ChatMessage) => void
) => {
  const {
    chatActivity, enableFetchCommitMessage, outdated,
    onCommit, startFetchingCommitMessage, setFetchingStarted,
    setProjectHasUpdated,
  } = commitMessageStore();
  const encodedProject = useMemo(() => projectCodec.encode(project), [project]);
  const subscription = trpcReact.projects.fetchStagedCommitMessage.useSubscription(
    enableFetchCommitMessage ? encodedProject : skipToken
  );
  const proposeCommitMessage = useCallback(() => {
    pushMessage({ content: 'Initiated fetching commit message...' });
    startFetchingCommitMessage();
  }, [startFetchingCommitMessage]);

  useEffect(() => {
    if (subscription.data) {
      const { data } = subscription;
      const { attempts, payload, project, retryTimeout } = data;

      const contentMessage = [
        `Attempt ${attempts.current} of ${attempts.maximum}: ${payload.status}.`,
        `${(Math.round(retryTimeout / 100) / 10)}s to retry.`
      ].join(' ');

      switch (payload.status) {
        case 'failed': {
          // Put in a message with the attempts and project. Also the failure message.
          const error = payload.message;
          pushMessage({
            content: [
              contentMessage,
              error,
              '(This could do with a component)'
            ].join(' '),
          });
        } break;
        case 'success': {
          // We get the structured commit message.
          const commitMessage = payload.response;
          if (typeof commitMessage === 'string') {
            console.log('WTF just happened?', data)
            return;
          }
          // This means we can have an action for committing.
          // That will need to be added to pushMessage.
          pushMessage({
            content: contentMessage,
          });
          pushMessage({
            actions: createElement(ProjectCommitButton, {
              message: commitMessage,
              onCommit,
              project,
              pushMessage,
            }),
            content: createElement(ProjectFormattedCommitMessage, commitMessage),
          });
        } break;
        default: {
          // Put in a message with the attempts and project.
          pushMessage({
            content: contentMessage,
          });
        } break;
      }
    }

    if (subscription.error) console.error('Commit message subscription error', subscription.error);
  }, [subscription]);

  useEffect(() => {
    console.log('enabled', enableFetchCommitMessage)
  }, [enableFetchCommitMessage]);
  useEffect(() => {
    if (subscription.status !== 'idle') return;
    setFetchingStarted();
  }, [subscription.status]);

  return {
    commitChatActivity: chatActivity,
    projectIsOutdated: outdated,
    proposeCommitMessage,
    setProjectHasUpdated,
  };
};
