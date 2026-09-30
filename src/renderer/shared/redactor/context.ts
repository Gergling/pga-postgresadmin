import { contextFactory } from "@gergling/ui-components";
import { usePersistent } from "../common";

export const {
  Provider: RedactorProvider,
  useContextHook: useRedactor,
} = contextFactory(() => {
  const { item: isRedacted, setItem: setIsRedacted } = usePersistent<boolean>(
    'redactor.isRedacted'
  );
  return { isRedacted, setIsRedacted };
}, 'redactor');
