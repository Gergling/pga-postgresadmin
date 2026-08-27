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
import { useProjectDetail } from "../context";
import { useLlmOperationUtils } from "../../ai";

export type ChatMessage = Optional<ChatMessageProps, 'role' | 'timestamp'>;

export const useCommitMessage = (
  project: ProjectRenderer,
  pushMessage: (message: ChatMessage) => void
) => {
  const {
    invalidate: invalidateLlmOperationQuery
  } = useLlmOperationUtils({
    featureName: 'project', operationName: 'staged-commit-message'
  });
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
  const { projectRefreshLocal } = useProjectDetail();

  useEffect(() => {
    if (subscription.data) {
      const { data } = subscription;
      const { attempts, llm, payload, project, retryTimeout } = data;

      const attemptMessage = [
        `Attempt ${attempts.current} of ${attempts.maximum}: ${payload.status}.`,
        `${(Math.round(retryTimeout / 100) / 10)}s to retry.`,
        `Using ${llm.name} ${llm.source}`,
        `${attempts.current === 1 ? 'experimentally' : 'for stability'}.`,
      ].join(' ');

      // On failure or success, we update the store to say as much.
      // TODO: Evaluate whether to move this to the store by just passing the
      // payload status.
      if (['failed', 'success'].includes(payload.status)) {
        setCommitMessageFetched();
        // TODO: We can invalidate the cache for this operation.
        invalidateLlmOperationQuery(); // TODO: Be aware that this returns a
        // promise. That means it should probably either be awaited or run a
        // refetch on the other end or something.
      }

      // One failure, we add a special message to the chat. Otherwise, we
      // *always* add a generic content message with the update information.
      if (payload.status === 'failed') {
        pushMessage({
          content: [
            attemptMessage,
            payload.message,
            '(This could do with a component)'
          ].join(' '),
        });
      } else {
        pushMessage({
          content: attemptMessage,
        });
      }

      // On success, we output a special message containing the commit message.
      if (payload.status === 'success') {
        const commitMessage = payload.response;
        // Responses can be a string, but shouldn't be.
        if (typeof commitMessage === 'string') {
          console.error('WTF just happened?', data)
          pushMessage({
            content: 'Commit message was a string. That is bad.',
          });
          return;
        }
        pushMessage({
          actions: createElement(ProjectCommitButton, {
            message: commitMessage,
            onCommit: () => {
              onCommit();
              projectRefreshLocal();
            },
            project,
            pushMessage,
          }),
          content: createElement(ProjectFormattedCommitMessage, commitMessage),
        });
      }
    }

    if (subscription.error) {
      console.error('Commit message subscription error', subscription.error);
      pushMessage({
        content: `Commit message subscription error: ${subscription.error.message}`,
      });
    }
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
