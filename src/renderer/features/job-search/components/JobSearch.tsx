import { Outlet } from "react-router-dom";
import { JOB_SEARCH_VIEW_CONFIG, NavigationTabs } from "../../../shared/navigation";
import { useMemo } from "react";
import { sigilFactory } from "../../svg-viewer/components/Sigiliser";
import { ErrorBoundary } from "../../../shared/common/components/ErrorBoundary";

// Storage:
// Minimum AND Ideal rate, so two sets of data stored. Each has:
// * The numeric value.
// * The currency (defaults to pounds). This can be deferred, but currency should be rendered anyway.
// * The "denominator", which would be something like annual, monthly take-home, daily, hourly.
//  * Minimum should default to monthly-take-home and ideal should default to annual.

// The analysis table can be calculated instantly with two columns (minimum and ideal) in the chosen currency.
// The rows can cycle through the calculations for hourly, daily, take-home-monthly, and annual.
// Cells containing the chosen values should be clearly marked.
// Currency will require some kind of API call and can be deferred, but I'm thinking tabs for various currencies. We can start with USD and euros when it comes to it.

// The minimum depends on things like the cost of living and commuting to the job.
// That means I could hook up my finances and compare accordingly.
// The ideal depends on the market.
// This can be evaluated by a machine for various purposes, but for now we just need calculations.
// Perm. Annual to hourly conversion should be ~= (perm x (1.5 to 2 range, so that means we can use 1.5 for the minimum and 2 for the ideal)).
// Then divide by 220 working days. Might want to check if this is an acceptable day rate.
// Then divide by 8 hours.

const getTabs = () => JOB_SEARCH_VIEW_CONFIG.map(({ label, path, icon }, value) => ({
  icon: icon || sigilFactory(label?.slice(0, 6) || 'Workflower'),
  label: label || '',
  path: path || '',
  selected: false,
  value,
}));

// type JobSearchApplication = {
//   id: string;
//   name: string;
// };

// const dataGridProps: DataGridProps<JobSearchApplication> = {
//   checkboxSelection: true,
//   columns: [],
//   disableRowSelectionOnClick: true,
//   initialState: {
//     pagination: {
//       paginationModel: {
//         pageSize: 10,
//       },
//     },
//   },
//   loading: false,
//   pageSizeOptions: [],
//   rows: [],
//   slotProps: {
//     loadingOverlay: {
//       variant: 'linear-progress',
//       noRowsVariant: 'skeleton',
//     },
//   },
// };


export const JobSearch = () => {
  const tabs = useMemo(() => getTabs(), []);
  return <>
    <NavigationTabs tabs={tabs} />
    <ErrorBoundary fallback={<>Job searching did a bad.</>}>
      <div style={{ padding: '0 2rem' }}>
        <Outlet />
      </div>
    </ErrorBoundary>
  </>;
};
