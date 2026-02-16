export const CRM_COLLECTION_NAMES = ['companies', 'people', 'employment'] as const;

export type CrmCollectionName = typeof CRM_COLLECTION_NAMES[number];
