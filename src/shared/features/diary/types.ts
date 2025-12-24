export interface DiaryEntryBase {
  id?: string;
  text: string;

  // All entries are created as draft.
  // When done, user clicks to commit.
  // When the council has read the entry, it is processed.
  status: 'draft' | 'committed' | 'processed';

  // TODO: Needs more thought.
  // This shows where the entry was made from. Undefined means straight from the main diary interface.
  context?: {
    activeTaskId?: string;   // Link to a specific UserTask
    relatedEmailId?: string; // Link to an ingested email
    appContext?: string;     // e.g., "VS Code", "Chrome: HMRC Login"
    location?: string;       // e.g., "Studio", "Desk"
  };
}

export interface DiaryEntryDb extends DiaryEntryBase {
  created: number;
}
