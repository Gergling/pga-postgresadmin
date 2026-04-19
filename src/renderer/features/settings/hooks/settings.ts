import { createFormHook, useStore } from '@tanstack/react-form';
import {
  APPLICATION_SETTINGS_SCHEMA,
  ApplicationSettings
} from '@/shared/features/settings';
import { fieldContext, formContext } from '@/renderer/libs/react-form';
import { trpcReact } from '@/renderer/libs/react-query';
import { SettingsField } from '../components';

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { SettingsField },
  formComponents: {},
});

export const useSettingsEditor = () => {
  const { data: allSettings } = trpcReact.settings.fetchAll.useQuery();
  const { mutate } = trpcReact.settings.update.useMutation();
  const form = useAppForm({
    defaultValues: allSettings,
    onSubmit: ({ value }: { value: ApplicationSettings }) => {
      mutate(value);
    },
    validators: { onChange: APPLICATION_SETTINGS_SCHEMA },
  });
  const isSubmittable = useStore(
    form.store, (state) => state.canSubmit && state.isDirty
  );

  return {
    form,
    isSubmittable,
  };
};
