import { FirestoreRepository, ID } from '@spacelabstech/firestoreorm';
import { NeDbWrapper } from '../nedb';

export type SyncableCollection<T extends { id?: ID; } = { id?: ID; }> = {
  emit: (envelope: T) => boolean;
  local: NeDbWrapper<T>;
  name: string;
  remote: FirestoreRepository<T>;
};
