import z from "zod";
import { useField, useForm, useStore } from "@tanstack/react-form";
import { Grid, Stack } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  taskCoreSchema,
  taskFactory,
  TaskSerialisation,
  taskSerialisationSchema,
  taskWorkflowStateSchema
} from "@/shared/features/user-tasks";
import { Dropdown } from "@/renderer/shared/common";
import { List, ListItem } from "@/renderer/shared/list";
import { trpcReact } from "@/renderer/libs/react-query";
import {
  Button,
  Fieldset,
  FormTitle,
  TextField
} from "@/renderer/shared/form";
import { DossierContainer } from './Detail.style';

const MINIMUM_SUMMARY_FIELD_LENGTH = 4;
const MINIMUM_DESCRIPTION_FIELD_LENGTH = 12;

const getErrorText = (error: unknown): string => {
  if (typeof error === 'object' && error && 'message' in error)
    return String(error.message);

  return String(error);
};

const FieldErrors = ({
  errors, isTouched
}: { errors: unknown[]; isTouched: boolean; }) => {
  const hasError = isTouched && errors.length > 0;
  if (!hasError) return null;
  return <List>{errors.map((error, key) => {
    return <ListItem key={key}>
      <div><div style={{ paddingLeft: '1rem' }}>
        {getErrorText(error)}
      </div></div>
    </ListItem>
  })}</List>;
}

const statusOptions = taskWorkflowStateSchema.options.reduce(
  (options, value) => {
    if (['proposed', 'rejected'].includes(value)) return options;
    return [...options, { value, label: value.toUpperCase() }];
  }, []
);

const defaultValues = taskFactory.fromCore({
  // description: '',
  status: 'todo',
  // timeline: {},
}).envelope.data;
export const TaskCreation = () => {
  const navigate = useNavigate();
  const { refetch } = trpcReact.tasks.read.useQuery({ type: 'incomplete' });
  const {
    mutateAsync: createTask,
    isPending
  } = trpcReact.tasks.create.useMutation();
  const form = useForm({
    defaultValues,
    validators: {
      onChange: ({ formApi, value }) => {
        const result = taskCoreSchema.safeParse(value);
        if (result.success) return;
        return result.error.issues.map(e => e.message).join(', ');
      },
    },
    onSubmit: async ({ value }) => {
      console.log('submitting...', value)

      const serialised: TaskSerialisation = taskSerialisationSchema.parse({
        data: value
      });

      const task = await createTask(serialised);
      await refetch();
      await navigate(`/tasks/awaiting/${task.id}`);
    },
  });
  const summary = useField({
    form, name: 'summary',
    validators: {
      onChange: z.string().min(MINIMUM_SUMMARY_FIELD_LENGTH, {
        error: ({ value }) => {
          if (typeof value !== 'string') return 'Summary must be a string.';
          const diff = MINIMUM_SUMMARY_FIELD_LENGTH - value.length;
          if (diff === 1) return 'Summary must be at least one more character.';
          if (diff > 1) return `Summary must be at least ${diff} more characters.`;
          return `Summary must be at least ${MINIMUM_SUMMARY_FIELD_LENGTH} characters.`;
        }
      }).nonempty('Summary is required')
    }
  });
  const description = useField({
    form, name: 'description',
    validators: {
      onChange: z.string().min(MINIMUM_DESCRIPTION_FIELD_LENGTH, {
        error: ({ value }) => {
          if (typeof value !== 'string') return 'Description must be a string.';
          const diff = MINIMUM_DESCRIPTION_FIELD_LENGTH - value.length;
          if (diff === 1) return 'Description must be at least one more character.';
          if (diff > 1) return `Description must be at least ${diff} more characters.`;
          return `Description must be at least ${MINIMUM_DESCRIPTION_FIELD_LENGTH} characters.`;
        }
      }).nonempty('Description is required')
    }
  });

  const isSubmittable = useStore(
    form.store, (state) => state.canSubmit && state.isDirty
  );
  useStore(
    form.store, console.log
  );
  // console.log(form.)
  useEffect(() => {
    console.log('va;ues', form.store.state.values)
    console.log('state', form.store.state)
  }, [form]);

  // TODO: Project selector (autocomplete).

  return <DossierContainer>
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <Stack spacing={2} sx={{ p: 2 }}>
        <FormTitle>Create Task</FormTitle>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Fieldset legend='Status'>
              <form.Field name="status">
                {(field) => (
                  <Dropdown
                    onSelect={(value) => field.handleChange(value)}
                    options={statusOptions}
                    selected={field.state.value}
                  />
                )}
              </form.Field>
            </Fieldset>
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Fieldset legend='Summary'>
              <Stack>
                <TextField
                  onPersist={summary.setValue}
                  required
                  value={summary.state.value}
                />
                <FieldErrors {...summary.state.meta} />
              </Stack>
            </Fieldset>
          </Grid>
        </Grid>
        <Fieldset legend='Description'>
          <Stack>
            <TextField
              onPersist={description.setValue}
              required
              value={description.state.value}
            />
            <FieldErrors {...description.state.meta} />
          </Stack>
          {/* <form.Field name="description">
            {(field) => (
              <TextField
                onPersist={field.setValue}
                required
                value={field.state.value}
              />
            )}
          </form.Field> */}
        </Fieldset>
        <Button
          type={'submit'}
          onClick={() => form.handleSubmit()}
          disabled={!isSubmittable}
        >Create Task</Button>
      </Stack>
    </form>
  </DossierContainer>;
};
