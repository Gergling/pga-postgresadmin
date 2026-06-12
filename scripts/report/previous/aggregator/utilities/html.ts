import { interpolateHue } from "../../../../src/common/utilities";
import { ANALYTICS_GROUPS, OVERVIEW_VISIBILITY_STATUSES, VISIBILITY_STATUSES } from "../constants";
import {
  AggregationGroup,
  OverviewVisibilityStatusLabel,
  ReportAggregatorReturnType,
  SummarisedFile,
  VisibilityStatus,
  VisibilitySummary
} from "../types";
import { getMean } from "./maths";
import { getGroupedAggregation, getGroupedMeanAggregationStatus } from "./summary";

type GetHtml<T> = (groups: AggregationGroup<string>, props: T) => string;

type OverviewVisibilityStatus = VisibilityStatus | 'overview' | 'reports';

const formattedVisibilityStatuses = [
  'highlight',
  'default',
  'mute',
  'overview',
];

const getOverviewVisibilityCellHtml = (
  name: string,
  label: string,
  value: string,
  {
    child = '',
    colour = '#666',
    even = false,
  }: {
    child?: string;
    colour?: string;
    even?: boolean;
  } = {
    child: '',
    colour: '#666',
    even: false,
  },
) => `
  <div
    class="
      overview-visibility-cell
      ${even ? 'even' : 'odd'}
      ${name}
    "
  >
    <div class="body">
      <div class="label">${label}</div>
      <div class="value" style="
        background-color: ${colour};
      ">${value}</div>
    </div>
    ${child && `<div class="child">${child}</div>`}
  </div>
`;

const recurseOverviewVisibilityStatusHtmlFactory = (
  visibilityStatusMap: Record<OverviewVisibilityStatus, number>
) => (
  [{ name, label }, ...labels]: OverviewVisibilityStatusLabel[]
): string => {
  const value = visibilityStatusMap[name];
  const childrenCount = labels.length;
  const even = childrenCount % 2 === 0;
  const child = !childrenCount ? undefined : recurseOverviewVisibilityStatusHtmlFactory(visibilityStatusMap)(labels);
  if (!formattedVisibilityStatuses.includes(name)) return getOverviewVisibilityCellHtml(name, label, value.toString(), { child, even });
  const { text, colour } = getValueString(value);
  const html = getOverviewVisibilityCellHtml(name, label, text, { colour, child, even });
  return html;
};

// Left panel: Highlight, overview, default, mute, total reports
const getOverviewVisibilityHtml: GetHtml<VisibilitySummary> = (
  groups,
  visibility
) => {
  // TODO: I want the mean of each visibility level. That means I need to take
  // an aggregation object for each visibility level and cycle through all the
  // values at each level.
  // Then I need to calculate an overview, which can be the mean.
  // I also need to keep a count of the number of reports I've cycled through.
  const reports = Object.keys(groups).length;
  const visibilityStatusMap = Object.entries(visibility).reduce((
    acc,
    [visibilityStatusStr, aggregationStatus]
  ) => {
    const visibilityStatus = visibilityStatusStr as VisibilityStatus;
    // Each row has a visibility status label
    const values = Object.values(aggregationStatus).reduce<number[]>((
      acc,
      statusLevel
    ) => [...acc, statusLevel], []);
    const value = getMean(values);

    return {
      ...acc,
      [visibilityStatus]: value,
    };
  }, {
    reports,
  } as unknown as Record<OverviewVisibilityStatus, number>);
  const overviewSet = VISIBILITY_STATUSES.reduce<number[]>((
    acc,
    { name }
  ) => [...acc, visibilityStatusMap[name]], []);

  visibilityStatusMap.overview = getMean(overviewSet);

  // const html = OVERVIEW_VISIBILITY_STATUSES.map(({ name, label }) => {
  //   const value = visibilityStatusMap[name];
  //   if (!formattedVisibilityStatuses.includes(name)) return getOverviewVisibilityCellHtml(name, label, value.toString());
  //   const { text, colour } = getValueString(value);
  //   const html = getOverviewVisibilityCellHtml(name, label, text, colour);
  //   return html;
  // }).join('');
  const html = recurseOverviewVisibilityStatusHtmlFactory(visibilityStatusMap)(OVERVIEW_VISIBILITY_STATUSES);

  // console.log(visibilityStatusMap)
  return `
    <div class="visibility">
      ${html}
    </div>
  `;
};

const getValueString = (value: number | undefined): {
  text: string;
  colour: string;
} => {
  if (value === undefined) return { text: '-', colour: '#777' };
  const hue = interpolateHue(value, 0, 1);
  const colour = `hsl(${hue}, 100%, 25%)`;
  return { text: (value * 100).toFixed(0), colour };
};

const getCellInnerHtml = (
  text: string,
  colour: string
) => `
  <div
    style="
      border-color: ${colour};
      border-radius: 5px;
      border-style: solid;
      border-width: 2px;
      margin: 5px;
      padding: 5px;
      text-align: center;
      width: 100px;
    "
  >${text}</div>
`;

const getValueHtml = (value: number | undefined): string => {
  const { text, colour } = getValueString(value);
  return getCellInnerHtml(text, colour);
};

const getOverviewGroupHtml: GetHtml<VisibilitySummary> = (
  groups,
  visibility
) => {
  const groupStatus = getGroupedAggregation(groups);
  console.log('groups', groups, visibility, groupStatus)
  // TODO: Find the number of aggregation names for each group.
  const headerRowHtml = ANALYTICS_GROUPS.map(({ label }) => `<th>${label}</th>`).join('');
  const visibilityStatusRowHtml = VISIBILITY_STATUSES.map(({
    name: visibilityStatus,
    label: rowLabel,
  }) => {
    // Each row has a visibility status label
    const aggregationStatus = visibility[visibilityStatus] || {};
    const groupStatus = getGroupedMeanAggregationStatus(aggregationStatus, groups);
    const cellHtml = ANALYTICS_GROUPS.map(({ name }) => {
      const value = groupStatus[name];
      const html = getValueHtml(value);
      return `<td>${html}</td>`;
    }).join('')
    return `
      <tr>
        <th>${rowLabel}</th>
        ${cellHtml}
      </tr>
    `;
  }).join('');
  const aggregationsCellHtml = ANALYTICS_GROUPS.map(
    ({ name }) => `<td>${getCellInnerHtml((groupStatus[name]?.length || 0).toString(), 'transparent')}</td>`
  ).join('');
  const aggregationsRowHtml = `
    <tr>
      <th>Reports</th>
      ${aggregationsCellHtml}
    </tr>
  `;
  return `
    <div class="group">
      <table>
        <thead>
          <tr>
            <th></th>
            ${headerRowHtml}
          </tr>
        </thead>
        <tbody>
          ${visibilityStatusRowHtml}
          ${aggregationsRowHtml}
        </tbody>
      </table>
    </div>
  `;
};

// Right panel: Live, coverage, linting columns
const getOverviewHtml: GetHtml<VisibilitySummary> = (groups, visibility) => {
  const visibilityHtml = getOverviewVisibilityHtml(groups, visibility);
  const groupHtml = getOverviewGroupHtml(groups, visibility);

  return `
    <div class="overview">
      ${visibilityHtml}    
      ${groupHtml}
    </div>
  `;
};

const getTableHtml: GetHtml<SummarisedFile[]> = (report) => `
  <table></table>
`; 

export const getReportHTML = ({ groups, summarise }: ReportAggregatorReturnType) => {
  const { summarised, visibility } = summarise();
  return [
    getOverviewHtml(groups, visibility),
    getTableHtml(groups, summarised)
  ].join('');
};
