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
  pushMessage: (message: ChatMessage) => void
) => {
  const {
    chatActivity, enableFetchCommitMessage, outdated,
    onCommit, setCommitMessageFetched, startFetchingCommitMessage,
    setFetchingStarted, setProjectHasUpdated,
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

      // On failure or success, we update the store to say as much.
      // TODO: Evaluate whether to move this to the store by just passing the
      // payload status.
      if (['failed', 'success'].includes(payload.status)) {
        setCommitMessageFetched();
      }

      // One failure, we add a special message to the chat. Otherwise, we
      // *always* add a generic content message with the update information.
      if (payload.status === 'failed') {
        pushMessage({
          content: [
            contentMessage,
            payload.message,
            '(This could do with a component)'
          ].join(' '),
        });
      } else {
        pushMessage({
          content: contentMessage,
        });
      }

      // On success, we output a special message containing the commit message.
      if (payload.status === 'success') {
        const commitMessage = payload.response;
        // Responses can be a string, but shouldn't be.
        if (typeof commitMessage === 'string') {
          console.error('WTF just happened?', data)
          return;
        }
        pushMessage({
          actions: createElement(ProjectCommitButton, {
            message: commitMessage,
            onCommit,
            project,
            pushMessage,
          }),
          content: createElement(ProjectFormattedCommitMessage, commitMessage),
        });
      }
    }

    if (subscription.error) console.error('Commit message subscription error', subscription.error);
  }, [subscription]);

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
