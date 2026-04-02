import { GridColDef } from "@mui/x-data-grid";
import { JobSearchDbSchema } from "../../../../shared/features/job-search";
import { DataGrid, useDataGrid } from "../../../shared/grid";
import { useJobSearchApplicationsIpc } from "../hooks";

// type JobSearchApplication = {
//   // Status.
//   phase: JobSearchApplicationPhaseName;

//   // The actual job.
//   role: string;
//   salary: {
//     // Undefined if unknown.
//     // The numbers are equal if a single number is provided.
//     min?: number;
//     max?: number;
//   };

//   // Process.
//   offer?: { // If an offer has been made....
//     notes: string;
//     salary: number;
//   };
//   sourceType: 'agent' | 'listing';
//   stages: JobSearchApplicationStage[]; // Application stages (if known, otherwise empty array).

//   // Contacts.
//   contacts: JobSearchApplicationContact[]; // Random related contacts.

//   agency?: CrmArchetype['base']['companies']; // The representing agency (if known).
//   company?: CrmArchetype['base']['companies']; // Company with the position (if known).
//   manager?: CrmArchetype['base']['people']; // Hiring manager (if known).
//   referral?: CrmArchetype['base']['people']; // If the role was referred (if there is one).

//   interactions: JobSearchInteraction[];

//   // Unstructured text, for things like the kob description, etc.
//   notes: string;
// };

const columns: GridColDef<JobSearchDbSchema['base']['applications']>[] = [
  {
    field: 'role',
    headerName: 'Role',
    // renderCell: InteractionSourceCellRenderer,
    // width: 75,
  },
  {
    // TODO: This is really to be processed as a "what action to take" metadata
    field: 'phase',
    headerName: 'Phase',
  },
  // The salary is ofc very interesting.
  // We want to show a company if it exists
  // We would ideally see an agency and representative agent
  // The hiring manager should show up (if known).
  // We can also show information on the frequency of interactions for this application. Probably we want to aim for 4 applications with at least 1 interaction a week.
];

export const JobSearchApplicationList = ({
  edit,
}: {
  edit: (applicationId: JobSearchDbSchema['id']['applications']) => void;
}) => {
  const { applications } = useJobSearchApplicationsIpc();
  const dataGridProps = useDataGrid({
    columns,
    onRowClick: ({ row: { id } }) => edit(id),
    rows: applications ? [...applications.values()] : [],
  });
  if (!applications) return <>No applications to load.</>;
  return <>
    <DataGrid
      {...dataGridProps}
    />
  </>;
};
