// TODO: Do we need this?
import { UserTask, UserTaskAudit } from "../../../shared/features/user-tasks";
import { UserTaskDb } from "./types";

export const getUserTaskAudit = (previous: UserTaskDb, latest: Partial<UserTask>): UserTaskDb['audit'][number] => {
  // Cycle through "latest" object properties. We will assume it has at least one property.
  // Deep compare value of every property to the previous object.
  // Return the property and state of every changed property.
  // The output object should include at least one property.
  // If not, there's no justification to run an update in the first place.
  // Ideally this would just supply an info log if it happens, so this function should probably output a "report".
  // E.g. "no properties to change" or "no properties changed".
  // This both saves space and makes it much easier to find what the exact changes were and on what date.
  // Omits audit, id and source.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { audit, id, source, ...rest } = previous;
  return rest;
};
