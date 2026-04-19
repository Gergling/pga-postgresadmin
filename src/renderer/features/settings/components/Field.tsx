import { useFieldContext } from "@/renderer/libs/react-form";
import { Block, Hazard } from "@/renderer/shared/base";
import {
  FormFieldLabel,
  SafetyControl,
  TextField,
  TextFieldProps
} from "@/renderer/shared/form";
import { Check, Edit } from "@mui/icons-material";
import { Grid, Stack } from "@mui/material";
import { useStore } from "@tanstack/react-form";

type SettingsFieldProps = Partial<Omit<TextFieldProps, 'onPersist' | 'value'>> & {
  hazard?: boolean;
  label: string;
};

export const SettingsField = ({ hazard, label, ...options }: SettingsFieldProps) => {
  const field = useFieldContext<string>();
  const isEditable = useStore(
    field.store,
    (state) => !state.value || state.meta.isDirty
  );
  const value = useStore(field.store, (state) => state.value);
  return <Stack>
    <FormFieldLabel>{label}</FormFieldLabel>
    <Grid container spacing={2}>
      <SafetyControl
        control={<Grid flexGrow={1}><TextField
          {...options}
          onPersist={field.setValue}
          value={value}
        /></Grid>}
        display={hazard
          ? <Hazard style={{ height: '40px', width: '100%' }} />
          : <Block>{value}</Block>
        }
        doneIcon={<Grid flexShrink={1}><Check /></Grid>}
        editable={isEditable}
        editIcon={<Grid flexShrink={1}><Edit /></Grid>}
        key={value}
        wx={{
          props: {
            width: '100%',
          },
        }}
      />
    </Grid>
  </Stack>;
};
