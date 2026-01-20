import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { create } from "zustand";
import { DiaryEntry } from "../../../../shared/features/diary/types";
import { Envelope, Mandatory } from "../../../../shared/types";
import { useIpc } from "../../../shared/ipc";
import { DiaryEntryUi, DiaryEntryUiNew, DiaryEntryUiOptional } from "../types";
import { cleanEntries, cleanEntry } from "../utilities";
import { createEnvelope } from "../../../shared/common/utilities/envelope";
import { Temporal } from "@js-temporal/polyfill";

type UnsavedDiaryEntry = Envelope<DiaryEntryUiNew>;
type NewlySavedDiaryEntry = Envelope<DiaryEntry>;

type SetEntries = (entries: (DiaryEntryUi | DiaryEntry)[]) => DiaryEntryUi[];

const store = create<{
  aboutToInitiateConvergence: boolean;
  addUnsavedEntry: (text: string) => UnsavedDiaryEntry;
  savedEntries: DiaryEntryUi[];
  setAboutToInitiateConvergence: (value: boolean) => void;
  setDraftEntry: (entry: NewlySavedDiaryEntry) => void;
  setSavedEntries: SetEntries;
  unsavedEntries: UnsavedDiaryEntry[];
  updateEntry: (entry: Omit<Mandatory<DiaryEntry, 'id'>, 'created'>) => void;
}>((set, get) => ({
  aboutToInitiateConvergence: false,
  savedEntries: [],
  unsavedEntries: [],
  setAboutToInitiateConvergence: (aboutToInitiateConvergence) => set({ aboutToInitiateConvergence }),
  setSavedEntries: (entries) => {
    const savedEntries = cleanEntries(entries);
    set({ savedEntries });
    return savedEntries;
  },
  addUnsavedEntry: (text) => {
    const entries = get().unsavedEntries;
    const unsavedEntry = createEnvelope({ text });
    const unsavedEntries = [...entries, unsavedEntry];
    set({ unsavedEntries });
    return unsavedEntry;
  },
  setDraftEntry: ({ content, id }) => {
    const unsavedEntries = get().unsavedEntries.filter((e) => e.id !== id);
    const savedEntries = cleanEntries([...get().savedEntries, content]);
    set({ savedEntries, unsavedEntries });
  },
  updateEntry: (entry) => {
    const entries = get().savedEntries.map((e): DiaryEntryUiOptional => {
      if (e.id === entry.id) return cleanEntry({ ...e, ...entry });
      return e;
    });
    const savedEntries = cleanEntries(entries);
    set({ savedEntries });
  },
}));

export const useDiaryIpc = () => {
  const {
    aboutToInitiateConvergence,
    addUnsavedEntry,
    savedEntries,
    setAboutToInitiateConvergence,
    setDraftEntry,
    setSavedEntries,
    unsavedEntries,
    updateEntry,
  } = store();
  const {
    createDraftDiaryEntry: create,
    fetchRecentDiaryEntries,
    subscribeToRitualTelemetry,
    triageTasks,
    updateDiaryEntry,
  } = useIpc();

  const createDraftDiaryEntryWrapper = useCallback(async (text: string) => {
    const envelope = addUnsavedEntry(text);
    return create(envelope);
  }, [create, addUnsavedEntry]);

  const {
    isError: isErrorCreatingDraft,
    isPending: isPendingCreatingDraft,
    isSuccess: isCreated,
    mutate: createDraftDiaryEntry,
  } = useMutation({
    mutationFn: createDraftDiaryEntryWrapper,
    onSuccess: setDraftEntry,
    onError: (error) => {
      console.error(error);
    }
  });
  const {
    isError: isErrorUpdating,
    isPending: isPendingUpdate,
    isSuccess: isUpdated,
    mutate: mutateDiaryEntry,
  } = useMutation({
    mutationFn: ({
      id, status, immediateConvergence
    }: {
      id: string; status: DiaryEntryUi['status']; immediateConvergence?: boolean;
    }) => updateDiaryEntry(id, { status }, immediateConvergence),
    onSuccess: updateEntry,
    onError: (error) => {
      console.error(error);
    }
  });
  const {
    data: entries,
    error: errorFetchingDiary,
    isError: isErrorFetchingDiary,
    isLoading,
    isPending: isPendingFetchingDiary,
  } = useQuery({
    queryKey: ['diary'],
    queryFn: fetchRecentDiaryEntries,
  });

  const commitDiaryEntry = useCallback(
    (id: string, immediateConvergence = false) => mutateDiaryEntry({ id, status: 'committed', immediateConvergence }),
    [mutateDiaryEntry]
  );
  const rejectDiaryEntry = useCallback((id: string) => mutateDiaryEntry({ id, status: 'rejected' }), [mutateDiaryEntry]);

  const ipcStatus = useMemo(() => ({
    create: {
      error: isErrorCreatingDraft,
      pending: isPendingCreatingDraft,
      success: isCreated,
    },
    update: {
      error: isErrorUpdating,
      pending: isPendingUpdate,
      success: isUpdated,
    },
    fetch: {
      error: errorFetchingDiary,
      loading: isLoading,
      pending: isPendingFetchingDiary,
      success: !isErrorFetchingDiary && !isPendingFetchingDiary,
    },
  }), [
    errorFetchingDiary,
    isCreated,
    isErrorCreatingDraft,
    isErrorFetchingDiary,
    isErrorUpdating,
    isLoading,
    isPendingFetchingDiary,
    isPendingUpdate,
    isUpdated,
  ]);

  // I'd rather this was updated directly from the useQuery call rather than what we're doing here.
  useEffect(() => {
    if (entries) {
      setSavedEntries(entries);
    }
  }, [entries, setSavedEntries]);

  const diaryEntries = useMemo(
    (): (DiaryEntryUi | Mandatory<DiaryEntryUi, 'id' | 'created'>)[] => [
      ...unsavedEntries.map(({ content, id, created }) => ({ ...content, id: id.toString(), created: Temporal.Instant.fromEpochMilliseconds(created) })),
      ...savedEntries,
    ],
    [savedEntries, unsavedEntries]
  );

  useEffect(() => subscribeToRitualTelemetry(({
    message,
    timestamp,
    triage
  }) => {
    console.log('Ritual Telemetry:', message, timestamp, triage)
    if (triage?.diary) {
      triage.diary.forEach(({ id, status }) => {
        updateEntry({ id, status });
      });
    }
  }), [subscribeToRitualTelemetry]);

  return {
    aboutToInitiateConvergence,
    commitDiaryEntry,
    createDraftDiaryEntry,
    diaryEntries,
    diaryEntriesSaved: savedEntries,
    ipcStatus,
    rejectDiaryEntry,
    setAboutToInitiateConvergence,
    triageTasks,
  };
};