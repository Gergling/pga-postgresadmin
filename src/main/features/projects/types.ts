import {
  Observer,
} from '@trpc/server/observable';
import { LanguageModelOrchestrationUpdateProps } from '@/main/shared';
import { CommitMessage, Project } from "@shared/features/projects";

export type GenerateCommitMessageUpdateProps = LanguageModelOrchestrationUpdateProps<
  CommitMessage
> & { project: Project; };

export type GenerateCommitMessageUpdateEmitter = Observer<
  GenerateCommitMessageUpdateProps, GenerateCommitMessageUpdateProps
>;
