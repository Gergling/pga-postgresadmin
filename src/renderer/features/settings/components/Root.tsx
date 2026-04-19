import { Grid, Stack } from "@mui/material";
import { useSettingsEditor } from "../hooks";
import {
  Button,
  Fieldset,
  FormTitle,
} from "@/renderer/shared/form";

export const SettingsRoot = () => {
  const { form, isSubmittable } = useSettingsEditor();

  return <form
    onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
    }}
  >
    <Stack spacing={2} sx={{ p: 2 }}>
      <FormTitle>Settings</FormTitle>
      <Button
        type={'submit'}
        onClick={() => form.handleSubmit()}
        disabled={!isSubmittable}
      >Save</Button>
      <Fieldset legend='Firebase'>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <form.AppField
              name="firebase.production"
              children={(field) => <field.SettingsField hazard label="Production" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <form.AppField
              name="firebase.development"
              children={(field) => <field.SettingsField hazard label="Development" />}
            />
          </Grid>
        </Grid>
      </Fieldset>
      <Fieldset legend='Gemini'>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <form.AppField
              name="gemini.apiKey"
              children={(field) => <field.SettingsField hazard label="API key" />}
            />
          </Grid>
        </Grid>
      </Fieldset>
      <Fieldset legend='Gmail'>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <form.AppField
              name="gmail.host"
              children={(field) => <field.SettingsField label="Host" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <form.AppField
              name="gmail.user"
              children={(field) => <field.SettingsField label="Port" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <form.AppField
              name="gmail.pass"
              children={(field) => <field.SettingsField hazard label="Password" />}
            />
          </Grid>
        </Grid>
      </Fieldset>
      <Fieldset legend='Projects'>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <form.AppField
              name="projects.path"
              children={(field) => <field.SettingsField label="Path" />}
            />
          </Grid>
        </Grid>
      </Fieldset>
    </Stack>
  </form>;
};
