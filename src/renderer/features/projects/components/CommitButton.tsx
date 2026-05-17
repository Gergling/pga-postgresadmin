import { useMemo } from "react";
import { Optional } from "@/shared/types";
import {
  CommitMessage,
  concatenateCommitMessage,
  Project
} from "@/shared/features/projects";
import { ChatMessageProps } from "@/renderer/shared/common";
import { trpcReact } from "@/renderer/libs/react-query";
import { Button } from "@/renderer/shared/form";

export const ProjectCommitButton = ({
  message,
  onCommit,
  project,
  pushMessage,
}: {
  message: CommitMessage;
  onCommit: (success?: boolean) => void;
  project: Project;
  pushMessage: (
    message: Optional<ChatMessageProps, 'role' | 'timestamp'>
  ) => void;
  startCommit?: () => void;
}) => {
  const messageStr = useMemo(() => concatenateCommitMessage(message), [message]);
  const { isPending, isSuccess, mutate } = trpcReact.projects.commitStagedFiles.useMutation({
    onSettled: (data) => {
      if (data) {
        if (data.stderr) {
          pushMessage({
            content: <>
              An error occurred while committing: <strong>{data.stderr}</strong>
              <strong>{data.stdout}</strong>
            </>
          });
          return onCommit(false);
        }

        // TODO: Refetch the staged files for this project.
        pushMessage({
          content: <>
            Commit generated this std output: <strong>{data.stdout}</strong>
          </>
        });

        return onCommit(true);

      }
      onCommit();
    },
  });
  const commit = () => mutate({ project, message: messageStr });

  return <Button disabled={isSuccess || isPending} onClick={commit}>
    Commit
  </Button>
};
