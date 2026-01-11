import { CellRenderer } from "../types";

export const TaskVotesCellRenderer: CellRenderer = ({ row: { votes } }) => {
  // TODO: Need to make design decisions and consider these views:
  // Limited: Omits the value of the vote and shows only whether they have
  // voted on it or abstained using emoji of the relevant colour. I don't know
  // if I want this yet.
  // Council: Shows only the specified council members, rather than all
  // possible council members. This is useful for the "proposed" view, where
  // only certain council members (e.g. Librarian for now) will have created
  // tasks.
  // The text provided is nonsense to illustrate the testing phase.
  return <>Smoke!</>
};
