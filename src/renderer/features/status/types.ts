import { FirebaseDatabaseStatus } from "@/shared/lib/firebase";

type StatusSystemComputeSeparated = {
  type: 'trend';
  value: number[];
} | {
  type: 'value';
  value: number;
};

export type StatusSystemComputeDisplay = {
  type: 'separated';
  value: {
    cpu: StatusSystemComputeSeparated;
    memory: StatusSystemComputeSeparated;
  };
} | {
  type: 'combined';
  compute: 'band';
};
