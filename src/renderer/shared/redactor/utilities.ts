export const showRedactedContent = ({ isDeclassified, isRedacted }: {
  isDeclassified: boolean; isRedacted: boolean;
}) => {
  if (isDeclassified) return true;
  return !isRedacted;
};
