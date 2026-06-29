import { DiaryEntrySerialisation, diaryEntrySerialisationSchema } from "@/shared/features/diary";
import { trpcReact } from "@/renderer/libs/react-query";
import { diaryInputStore } from "../stores";

export const useDiaryEntryCreator = () => {
  const { setText, text } = diaryInputStore();
  const {
    isError: isErrorCreatingDraft,
    isPending: isPendingCreatingDraft,
    isSuccess: isCreated,
    mutate,
  } = trpcReact.diary.create.useMutation({
    onSuccess: () => setText(''),
  });

  const create = (onSuccess: () => void) => {
    const entry: DiaryEntrySerialisation = diaryEntrySerialisationSchema.parse({
      data: { text }
    });
    // TODO: Set the cache with the id as the creationKey or whatever.
    mutate(entry, { onSuccess });
  };

  return {
    isErrorCreatingDraft,
    isPendingCreatingDraft,
    isCreated,
    text,
    create,
    setText,
  };
};
