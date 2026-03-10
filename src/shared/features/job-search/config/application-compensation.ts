// This really should be handled by a language model, but for common cases, this can be hardcoded.

export const ROLE_SENIORITY = ['mid', 'senior', 'staff', 'lead'] as const;
export type RoleSeniority = typeof ROLE_SENIORITY[number];

// Figures are annual.
export const ROLE_COMPENSATION = {
  minimum: 40000, // The absolute minimum for a remote junior-mid role.
  maximised: 20000, // Added if they ask for a range.
  senior: 20000, // Added for a senior role.
  hybridPerDay: 2000, // Added for each weekly day expected in the office.
  fullRto: 5000, // Added with hybridPerDay if the role is in the office full time.
  staff: 10000, // Added with seniority for staff roles.
  lead: 5000, // Added with staff for lead roles.
} as const;

export type RoleCompensationKey = keyof typeof ROLE_COMPENSATION;
