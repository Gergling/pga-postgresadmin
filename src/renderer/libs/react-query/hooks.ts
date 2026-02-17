import { useQueryClient } from "@tanstack/react-query";
import { ArchetypeMapEntryDefault } from "../../../shared/lib/typesaurus";

export const useQueryDataFactory = <T extends ArchetypeMapEntryDefault['base']>(
  keyBase: string
) => {
  const queryClient = useQueryClient();
  const key = [keyBase];
  return (
    updatedData: T
  ) => {
    queryClient.setQueryData<T>([...key, updatedData.id], updatedData);

    queryClient.setQueryData<T[]>(key, (originalData) => {
      if (!originalData) return [updatedData];
      
      const exists = originalData.find(p => p.id === updatedData.id);
      if (exists) {
        // It was an update
        return originalData.map(p => p.id === updatedData.id ? { ...p, ...updatedData } : p);
      } else {
        // It was a creation
        return [...originalData, updatedData];
      }
    });
  };
};
