// A lot of fuzzy logic is being ignored here.


import { ROLE_COMPENSATION, ROLE_SENIORITY, RoleCompensationKey } from "../../../../shared/features/job-search";
import { JobSearchApplicationUi } from "../types";

const getOnSiteRange = (onSite: JobSearchApplicationUi['onSite']): {
  min: number;
  max: number;
} => {
  // If we don't know, we assume it's a hybrid role at minimum 2 days, and possibly full RTO. Ambiguity costs more.
  if (typeof onSite === 'undefined') return { min: 2, max: 5 };

  // It's either fully remote or RTO.
  if (typeof onSite === 'boolean') {
    if (onSite) return { min: 5, max: 5 };
    return { min: 0, max: 0 };
  }

  // If it's hybrid, but we don't know other details, we assume it's not RTO (at least for now).
  if (typeof onSite === 'string' && onSite === 'hybrid') return { min: 2, max: 4 };

  // If it's a number, it's the number of days per week. We add one to the maximum for pessimism.
  if (typeof onSite === 'number') return { min: onSite, max: Math.min(onSite + 1, 5) };

  // Otherwise, we just provide the range.
  return onSite;
};

const getSeniorityFlags = (seniority: JobSearchApplicationUi['seniority']) => {
  const lead = seniority === 'lead';
  const staff = seniority === 'staff' || lead; // A lead role includes the level of senior.
  const senior = seniority !== 'mid'; // We assume it's a senior role if we don't know the seniority.
  return { lead, staff, senior };
};

export const getJobSearchApplicationCompensation = ({
  seniority,
  onSite,
}: Pick<JobSearchApplicationUi, 'seniority' | 'onSite'>) => {
  const onSiteRange = getOnSiteRange(onSite);
  const fullRto = onSiteRange.max >= 5;
  const onSiteMinimumCompensation = onSiteRange.min * ROLE_COMPENSATION.hybridPerDay;
  const onSiteMaximumCompensation = onSiteRange.max * ROLE_COMPENSATION.hybridPerDay;
  const seniorityFlags = getSeniorityFlags(seniority);

  return Object.entries({ fullRto, ...seniorityFlags }).reduce(({ min, max }, [key, value]) => {
    if (!value) return { min, max };

    const compensation = ROLE_COMPENSATION[key as RoleCompensationKey];
    return {
      min: min + compensation,
      max: max + compensation,
    };
  }, {
    min: ROLE_COMPENSATION.minimum + onSiteMinimumCompensation,
    max: ROLE_COMPENSATION.minimum + onSiteMaximumCompensation + ROLE_COMPENSATION.maximised,
  });
};

const onSiteDaysPerWeek: number[] = Array.from({ length: 6 }, (_, i) => i);

// If there is no role, we want a broader table by seniority and work location.
export const ROLE_COMPENSATION_TABLE = onSiteDaysPerWeek.reduce((rows, weeklyOnSiteDays) => {
  const onSiteCompensation = weeklyOnSiteDays * ROLE_COMPENSATION.hybridPerDay;
  const fullRto = weeklyOnSiteDays >= 5;
  const min = ROLE_COMPENSATION.minimum + onSiteCompensation;
  const max = min + ROLE_COMPENSATION.maximised;

  return ROLE_SENIORITY.reduce((rows, seniority) => {
    const seniorityFlags = getSeniorityFlags(seniority);
    const range = Object.entries({ fullRto, ...seniorityFlags }).reduce((range, [key, value]) => {
      if (!value) return range;

      const compensation = ROLE_COMPENSATION[key as RoleCompensationKey];
      return {
        ...range,
        min: range.min + compensation,
        max: range.max + compensation,
      };
    }, { fullRto, max, min, seniority, weeklyOnSiteDays });

    return [ ...rows, range ];
  }, rows);
}, []);

// export const ROLE_SENIORITY = ['mid', 'senior', 'staff', 'lead'] as const;
// export type RoleSeniority = typeof ROLE_SENIORITY[number];

// // Figures are annual.
// export const ROLE_COMPENSATION = {
//   minimum: 40000, // The absolute minimum for a remote junior-mid role.
//   maximised: 20000, // Added if they ask for a range.
//   senior: 20000, // Added for a senior role.
//   hybridPerDay: 2000, // Added for each weekly day expected in the office.
//   fullRto: 5000, // Added with hybridPerDay if the role is in the office full time.
//   staff: 10000, // Added with seniority for staff roles.
//   lead: 5000, // Added with staff for lead roles.
// } as const;

// export type RoleCompensationKey = keyof typeof ROLE_COMPENSATION;
