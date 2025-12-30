export type TriageEmailTasksResponse = {
  data: string;
  status: 'email';
} | {
  data: string;
  status: 'triage';
} | {
  data: string;
  status: 'success';
};
