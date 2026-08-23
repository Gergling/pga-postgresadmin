export type LogOptions = {
  debug?: boolean;
  parentCode?: string;
  /**
   * @deprecated Use showSummary instead.
   */
  showSummaryChildren?: boolean;
  showSummary?: boolean | 'suppress-children';
};
