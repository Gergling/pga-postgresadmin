import { Temporal } from "@js-temporal/polyfill";
import { JobSearchApplicationStageSchema, JobSearchDbSchema } from "../../../../shared/features/job-search";
import { JobSearchActivity, JobSearchApplicationUi } from "../types";
import {
  APPLICATION_PHASE_FSM, JOB_SEARCH_ACTIVITY_RANKS
} from "../constants";
import {
  getRelativeTimeNow
} from "@/renderer/shared/common/utilities/relative-time";

const getZonedDateTime = (epochMilliseconds: number) => {
  const instant = Temporal.Instant.fromEpochMilliseconds(epochMilliseconds);
  return instant.toZonedDateTimeISO(Temporal.Now.timeZoneId());
};

const getPlainDateTime = (epochMilliseconds: number) => {
  const zonedDateTime = getZonedDateTime(epochMilliseconds);
  return zonedDateTime.toPlainDateTime();
};

const getMostRecentInteraction = (
  interactions: JobSearchDbSchema['base']['interactions'][]
): JobSearchDbSchema['base']['interactions'] | undefined => interactions.reduce((mostRecentInteraction, interaction) => {
  if (!mostRecentInteraction) return interaction;

  return mostRecentInteraction.timeperiod.start > interaction.timeperiod.start
    ? mostRecentInteraction
    : interaction;
}, undefined as JobSearchDbSchema['base']['interactions'] | undefined);

const getActivityLevel = (earlierTime: Temporal.ZonedDateTime): JobSearchActivity => {
  // if (!earlierTime) return;
  const duration = getRelativeTimeNow(earlierTime);
  if (duration.months > 0) return 'cold';
  if (duration.weeks > 2) return 'warm';
  return 'hot';
};

const getInteractionActivity = (
  now: number,
  lastInteractionEpochMilliseconds?: number,
  expectedUpdateTime?: number
): Pick<JobSearchApplicationUi, 'active' | 'activity' | 'chase' | 'lastInteractionTime'> => {
  // const now = Date.now();
  const isExpectedUpdateTimeElapsed = expectedUpdateTime ? now > expectedUpdateTime : false;

  if (!lastInteractionEpochMilliseconds) {
    const activity = isExpectedUpdateTimeElapsed ? 'hot' : undefined;
    const active = !!activity;
    const chase = isExpectedUpdateTimeElapsed;
    return { active, activity, chase };
  }

  const zonedDateTime = getZonedDateTime(lastInteractionEpochMilliseconds);
  const activity = getActivityLevel(zonedDateTime);
  const active = !!activity;
  const chase = isExpectedUpdateTimeElapsed || activity === 'warm';
  const lastInteractionTime = {
    numeric: lastInteractionEpochMilliseconds,
    temporal: zonedDateTime.toPlainDateTime(),
  };
  return { active, activity, chase, lastInteractionTime };
}

const getUpcomingStageTime = (timeline: JobSearchApplicationStageSchema['timeline']): number | undefined => {
  if (typeof timeline === 'number') return timeline;
  if (typeof timeline === 'object') return timeline.start;
  return;
};

const getNextStage = (
  now: number,
  stages: JobSearchApplicationStageSchema[]
): {
  due: number | undefined;
  next: JobSearchApplicationStageSchema | undefined;
} => {
  const {
    due,
    upcoming: next,
  } = stages.reduce(({
    due,
    upcoming,
  }, stage) => {
    const { timeline } = stage;
    // ? timeline > Date.now()
    const time = getUpcomingStageTime(timeline);

    // If there is no time provided, we don't know when it will happen.
    if (!time) return { due, upcoming };

    // If it happened in the past, it is not upcoming.
    if (time < now) return { due, upcoming };

    // If we haven't already found an upcoming stage, we should use this one for comparison.
    if (!upcoming) return { due: time, upcoming: stage };

    // We know we have a comparable upcoming stage.
    const upcomingTime = getUpcomingStageTime(upcoming.timeline);
    if (!upcomingTime) return { due: time, upcoming: stage };

    // If the upcoming time is after the current stage (which we know is in the
    // future), we can assume the current stage should be considered the next
    // "upcoming" stage.
    if (upcomingTime > time) return { due: time, upcoming: stage };

    // Otherwise, this is the next upcoming stage.
    return { due, upcoming };
  }, { due: undefined, upcoming: undefined } as {
    due: number | undefined;
    upcoming: JobSearchApplicationStageSchema | undefined;
  });

  return { due, next };
};

export const createJobSearchUiApplication = (
  application: JobSearchDbSchema['base']['applications']
): JobSearchApplicationUi => {
  const now = Date.now();
  const { expectedUpdateTime, interactions, stages } = application;
  const mostRecentInteraction = getMostRecentInteraction(interactions);
  const overallActivity = getInteractionActivity(now, mostRecentInteraction?.timeperiod.start, expectedUpdateTime);
  const { due: numeric } = getNextStage(now, stages);
  const due = numeric ? {
    numeric,
    temporal: getPlainDateTime(numeric),
  } : undefined;
  const phaseData = APPLICATION_PHASE_FSM[application.phase];
  const isActionable = phaseData.next.some(({ name }) => name === 'pursue');

  return {
    ...application,
    ...overallActivity,
    isActionable,
    due
  };
};

export const comparePipelineApplications = (
  a: JobSearchApplicationUi,
  b: JobSearchApplicationUi
) => {
  // Ascending due date. Undefined means there is no due date. The nearest due date should go to the top.
  if (a.due?.numeric !== b.due?.numeric) {
    if (a.due === undefined) return 1;
    if (b.due === undefined) return -1;
    return a.due?.numeric - b.due?.numeric;
  }

  // Descending chase action. Items to be chased should go further up the list.
  if (a.chase !== b.chase) {
    if (a.chase) return -1;
    return 1;
  }

  // Descending activity. The rank actually uses the reverse numeric ordering due to the most common use-case.
  if (a.activity !== b.activity) {
    if (a.activity === undefined) return 1;
    if (b.activity === undefined) return -1;
    return JOB_SEARCH_ACTIVITY_RANKS[a.activity] - JOB_SEARCH_ACTIVITY_RANKS[b.activity];
  }

  // Descending lastInteractionTime. This is merely a more nuanced version of
  // descending activity, which technically makes the activity redundant.
  if (a.lastInteractionTime?.numeric !== b.lastInteractionTime?.numeric) {
    if (a.lastInteractionTime === undefined) return 1;
    if (b.lastInteractionTime === undefined) return -1;
    return b.lastInteractionTime?.numeric - a.lastInteractionTime?.numeric;
  }

  return 0;
};

// 1. Next interview date/time or test due date/time ascending.
// 2. Chase flag true -> false.
// 3. Most recent interaction date.

// Ideally have room for about 4 active "warm" applications at the top.
// Possibly the top one could be highlighted, and if nothing goes there, it advises to generate leads or something.


  // active: boolean; // Calculated from activity truthiness.
  // activity?: 'hot' | 'warm' | 'cold'; // Calculated from lastInteractionTime date/time. Applying for the job should count as an interaction.
  // chase: boolean;
  // due?: Temporal.PlainDateTime;
  // lastInteractionTime?: Temporal.PlainDateTime;

export const isStageTimelineSynchronous = (
  timeline: JobSearchDbSchema['base']['applications']['stages'][number]['timeline']
) => timeline === 'synchronous' || typeof timeline === 'object';
