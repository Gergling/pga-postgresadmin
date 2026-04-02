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


// I put this in one of the application form fields:

// At ON24 I was working as a senior developer on a large-scale webinar platform during a period of rapid growth driven by the shift to remote events. Engagement during live sessions was a key product concern, and we saw a clear drop-off both after registration and during sessions, with limited mechanisms to bring users back once they disengaged.

// I explored a mobile-first engagement feature focused on creating a real-time feedback loop through push notifications. The idea was to re-engage users at the right moments, prompting them to rejoin live sessions, respond to in-session interactions, or continue engaging asynchronously.

// I built out a working prototype using React Native, combining websocket-driven updates with push notifications to simulate real-time interaction patterns. A big part of the challenge was deciding what should trigger a notification versus what would just create noise, as well as managing timing and batching so that notifications felt relevant rather than intrusive. On the client side, I focused on keeping the UI responsive under frequent state changes driven by live updates.

// What I found particularly interesting was the engagement loop itself: how you reintroduce users at the right time, maintain a sense of immediacy, and create momentum within the product. That’s something I’ve been increasingly interested in, especially in more consumer-focused environments.

// That’s a big part of why this role stood out to me. It’s taking those kinds of engagement and feedback loops and operating them at a much larger scale.
