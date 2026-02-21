import { JobSearchArchetype } from "../../../../shared/features/job-search";

export const getShortSalary = ({ max, min }: JobSearchArchetype['base']['applications']['salary']) => {
  if (min === undefined) {
    if (max === undefined) {
      return '(?-Comp.)';
    }

    return `<£${max}k`;
  }
  if (max === undefined) {
    return `>£${min}k`;
  }

  const avg = (max + min) / 2;
  return `~£${avg}k`;
};
