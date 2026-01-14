export const TASK_VOTE_BASE = [
  { name: 'Awaiting', description: 'Awaiting a vote.' },
  { name: 'Abstained', description: 'Abstained from voting because more information is required.'},
] as const;

export const TASK_IMPORTANCE = [
  { name: 'Regressive', description: 'Actively damaging; inaction is better than action. Examples: Self-harm, bad habits, or bridges being burnt.'},
  { name: 'Negligible', description: 'Noise or distraction. Completing it yields zero growth and potentially wastes time better spent elsewhere.'},
  { name: 'Trivial', description: 'Low stakes. Nice to have, but the world doesn\'t change if it\'s never done. Minimal reward.'},
  { name: 'Maintenance', description: 'Basic upkeep. Keeping things from breaking, but not moving the needle forward (e.g., routine chores).'},
  { name: 'Incremental', description: 'Small, positive progress. Standard tasks that contribute to a larger goal without being "big wins."'},
  { name: 'Substantial', description: 'Noticeable reward. Tasks that clear a significant hurdle or provide a clear benefit to health/career.'},
  { name: 'Strategic', description: 'High-leverage. Tasks that unlock new opportunities or prevent significant future work/debt.'},
  { name: 'Pivotal', description: 'Transformative. Failure results in major loss (heavy fines, career setbacks); success yields high growth.'},
  { name: 'Critical', description: 'Mandatory/Existential. High-consequence deadlines. Inaction leads to systemic failure or severe life impact.'},
  { name: 'Legacy', description: 'Life-altering or "North Star" tasks. Core to identity, long-term health, or major aspirations.'},
] as const;

export const TASK_MOMENTUM = [
  { name: 'Sisyphean',	description: 'Work that feels like it reverts itself while being done. Frustrating, pointless, or technically broken.'},
  { name: 'Paralyzing',	description: 'High anxiety or dread. Requires extreme mental effort just to start. A "wall of awful."'},
  { name: 'Viscous',	description: 'Onerous and slow. Not scary, but physically or mentally exhausting (e.g., deep manual data entry).'},
  { name: 'Slogging',	description: 'Boring and repetitive. Low cognitive load but requires high "grit" to finish. (Admin without Elvanse).'},
  { name: 'Balanced',	description: 'Neutral. Standard effort required. No significant excitement, but no significant resistance.'},
  { name: 'Fluid',	description: 'Straightforward. You know exactly what to do and have the tools ready. Low friction.'},
  { name: 'Engaging',	description: 'Enjoyable. Interest-led tasks where you feel a slight pull toward completion.'},
  { name: 'Gliding',	description: 'Easy/Flow-adjacent. The task matches your current skill set perfectly; feels "downhill."'},
  { name: 'Propulsive',	description: 'Flow State. The task generates its own energy; you lose track of time while doing it.'},
  { name: 'Effortless',	description: 'Automatic. Habitual or so enjoyable it feels like play. Friction is effectively zero.'},
] as const;

export const COUNCIL_MEMBER = [
  { id: 'librarian',  label: 'The Librarian',  color: '#607D8B' }, // Slate
  { id: 'sceptic',    label: 'The Sceptic',    color: '#FF5252' }, // Red
  { id: 'guardian',   label: 'The Guardian',   color: '#4CAF50' }, // Green
  { id: 'strategist', label: 'The Strategist', color: '#2196F3' }, // Blue
  { id: 'philosopher',label: 'The Philosopher',color: '#9C27B0' }, // Purple
  { id: 'diplomat',   label: 'The Diplomat',   color: '#E91E63' }, // Pink
  { id: 'architect',  label: 'The Architect',  color: '#FF9800' }, // Orange
] as const;

export const VOTE_PROPS = {
  importance: TASK_IMPORTANCE,
  momentum: TASK_MOMENTUM,
} as const;
