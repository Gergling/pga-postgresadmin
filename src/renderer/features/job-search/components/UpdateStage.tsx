import { useMemo, useReducer, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  FormControlLabel,
  Grid,
  IconButtonProps,
  Link,
  Switch
} from "@mui/material";
import { useField, useForm } from "@tanstack/react-form";
import {
  ApplicationStageTechnicalLevel,
  JobSearchApplicationPhaseName,
  JobSearchApplicationStageSchema,
  JobSearchApplicationTransfer,
} from "../../../../shared/features/job-search";
import { Accordion } from "../../../shared/accordion";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  RegistryData
} from "../../../shared/card";
import { CircularTextContainer } from "../../../shared/container";
import { Dropdown } from "../../../shared/common/components/Dropdown";
import { TextField } from "../../../shared/form";
import {
  creativeAutocompleteSelectorValidatorFactory
} from "../../../shared/autocomplete";
import { Workflower } from "../../svg-viewer/components";
import { CrmPersonCreativeAutocomplete, CrmPersonOptionType } from "../../crm";
import {
  APPLICATION_PHASE_FSM,
  APPLICATION_STAGE_TECHNICAL_LEVEL_COLORS,
  APPLICATION_STAGE_TECHNICAL_LEVEL_OPTIONS
} from "../constants";
import { StyledAddStageButton } from "./UpdateStage.style";
import { LinearPhaseView } from "./UpdateStagePhase";
import { StageTimelineEditor } from "./UpdateStageTimeline";

type Stage = JobSearchApplicationTransfer['stages'][number];
type JobSearchUpdateStageProps =
  & Pick<JobSearchApplicationTransfer, 'phase' | 'stages'>
  & {
    setPhase: (phase: JobSearchApplicationPhaseName) => void;
    setStages: (stages: Stage[]) => void;
  }
;

// If stages: Show stages, otherwise, show phases. Whatever is current opens a list of options when clicked.
// Advance and reject control presets.
// Stage editor deep dive.
// Show a panel of cards showing existing stages. Cards show whether completed, "with [person]", sync/async, time and any notes.
// Can be edited to snap open a stage detail view.
// A new stage can be added, possibly tabbed as sync or async.

// Sync has a person field visible (even if empty) and optional start/end range with presets for 15, 30 and 60 minutes.
// Async has a person field only if populated already, and an optional due time/date.
// Existing stage has a completion indicator. Async has a control.
// Both have a technical level and notes.

// type Include<T, U> = T extends U ? T : never;

const getIsSync = (
  timeline: Stage['timeline']
) => timeline === 'synchronous' || typeof timeline === 'object';

const getStageTitle = (
  technicalLevel: ApplicationStageTechnicalLevel,
  timeline: Stage['timeline'],
  isFirst: boolean,
  isFirstSync: boolean,
): string => {
  const isSync = timeline === 'synchronous' || typeof timeline === 'object' ? 'synchronous' : 'asynchronous';
  const isTechnical = technicalLevel === 'high';
  if (isFirstSync) {
    return `Introductory${isTechnical ? '/Technical' : ''} interview`;
  }

  if (isFirst) {
    // We can assume asynchronous because otherwise isFirstSync will be true.
    return `${isTechnical ? 'Technical s' : 'S'}creening test`;
  }

  // Otherwise, it is not first, but could be sync.
  if (isSync) {
    return `${isTechnical ? 'Technical interview' : 'Interview'}`;
  }

  return `${isTechnical ? 'Technical test' : 'Test'}`;
};

// APPLICATION_STAGE_TECHNICAL_LEVEL
type StageCardProps = {
  deleteStage: () => void;
  isFirst: boolean;
  isFirstSync: boolean;
  setStage: (stage: Stage) => void;
  stage: Stage;
};
const StageCard = ({ setStage, stage: { timeline, ...stage } }: {
  setStage: (stage: Stage) => void; stage: Stage;
}) => {
  return <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <RegistryData>Timeline if populated with dates</RegistryData>
        <RegistryData>Person (if isSync or populated)</RegistryData>
        <RegistryData>Technical Level</RegistryData>
        <RegistryData>Notes</RegistryData>
      </CardContent>
      <CardActions>
        Completion: This needs to be clearly marked as a special case for sync stages.
        Asynchronous is sent to the point of contact (where a person is assigned).
      </CardActions>
    </Card>
  </Grid>;
};

const AddStageButton = ({ children, isSynchronous, ...props }: { isSynchronous?: boolean; } & IconButtonProps) => {
  const color = isSynchronous ? '#0ff' : '#ff0';
  return <StyledAddStageButton
    typeColor={color}
    {...props}
  >
    <CircularTextContainer color={color} style={{ width: 50, padding: 0 }}>
      {children}
    </CircularTextContainer>
  </StyledAddStageButton>;
};

const AddStageCard = ({ setEditor }: { setEditor: (isSynchronous: boolean) => void; }) => {
  return <Grid size={{ xs: 12, sm: 6, md: 3 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <AddStageButton onClick={() => setEditor(true)} isSynchronous>[]</AddStageButton>
      <AddStageButton onClick={() => setEditor(false)}>-]</AddStageButton>
    </div>
  </Grid>;
};

type StageEditorVisibility = Partial<Record<keyof Stage, boolean>>;
type StageEditorProps = {
  isFirst: boolean;
  isFirstSyncFound: boolean;
  setStage: (stage: Stage) => void;
} & ({
  deleteStage: () => void;
  isFirstSync: boolean;
  isNew: false;
  stage: Stage;
} | {
  isNew: true;
  isSync: boolean;
});
const StageEditor = (props: StageEditorProps) => {
  const { isFirst, isFirstSyncFound, isNew, setStage } = props;

  const {
    isSync,
    isFirstSync,
    ...stage
  } = useMemo((): Omit<Stage, 'person'> & {
    isSync: boolean; isFirstSync: boolean; person: CrmPersonOptionType | null;
  } => {
    if (isNew) {
      const isSync = props.isSync;
      return {
        completed: false,
        isSync,
        isFirstSync: isSync && !isFirstSyncFound,
        technical: 'low',
        notes: '',
        person: null,
        timeline: isSync ? 'synchronous' : 'asynchronous',
      };
    }
    return {
      ...props.stage,
      isSync: getIsSync(props.stage.timeline),
      isFirstSync: props.isFirstSync,
      person: props.stage.person ? { ...props.stage.person, title: props.stage.person.name } : null,
    };
  }, [props]);

  const form = useForm({
    defaultValues: {
      ...stage,
    },
  });

  const personField = useField({
    form, name: 'person',
    validators: {
      onChange: creativeAutocompleteSelectorValidatorFactory('Creating person...'),
    },
  });

  const title = useMemo(() => {
    const technical = form.getFieldValue('technical');
    const timeline = form.getFieldValue('timeline');
    return getStageTitle(technical, timeline, isFirst, isFirstSync);
  }, [form, isFirst, isFirstSync]);

  const [fieldVisibility, dispatchFieldVisibility] = useReducer((
    state: StageEditorVisibility,
    action: Partial<StageEditorVisibility>,
  ) => ({ ...state, ...action }), {
    person: isNew || isSync || stage.person !== undefined,
    completed: !isNew && (stage.completed || !isSync),
    notes: true,
    technical: true,
    timeline: isNew || typeof stage.timeline !== 'string',
  });

  const showFields = useMemo(() => {
    return Object.entries(fieldVisibility).reduce((acc, [key, value]) => {
      if (value) return acc;
      return [...acc, key];
    }, []);
  }, [fieldVisibility]);

  // TODO: Sync completed stages are theoretically overwritable, but should switch to completed in the backend when the end time passes.
  return <Grid container spacing={2}>
    <Grid size={{ xs: 12 }}>{title}</Grid>
    {fieldVisibility.completed && <Grid size={{ xs: 6, md: 3 }}>
      <form.Field name="completed">{(field) => (<FormControlLabel
        control={<Switch onChange={({ target: { checked } }) => field.setValue(checked)} value={field.state.value} />}
        label="Completed"
      />)}</form.Field>
    </Grid>}

    {fieldVisibility.timeline && <Grid size={{ xs: 12 }}>
      <form.Field name="timeline">
        {(field) => (
          <StageTimelineEditor timeline={field.state.value} setTimeline={field.setValue} />
        )}
      </form.Field>
    </Grid>}

    {fieldVisibility.technical && <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <form.Field name="technical">
        {(field) => (<>
          <FormControlLabel
            control={
              <Dropdown
                icon={
                  <Workflower
                    size="small"
                    color={APPLICATION_STAGE_TECHNICAL_LEVEL_COLORS[field.state.value]}
                  />
                }
                onSelect={(value) => field.setValue(value.toString() as ApplicationStageTechnicalLevel)}
                options={APPLICATION_STAGE_TECHNICAL_LEVEL_OPTIONS}
                selected={field.state.value}
                showSelectedText
              />
            }
            label="Technical Level"
            labelPlacement="start"
          />
        </>)}
      </form.Field>
    </Grid>}

    {fieldVisibility.person && <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <CrmPersonCreativeAutocomplete state={personField.state} setValue={personField.setValue} />
    </Grid>}

    {fieldVisibility.notes && <Grid size={{ xs: 12, md: 5 }}>
      <form.Field name="notes">
        {(field) => (
          <TextField label="Notes" onPersist={field.setValue} value={field.state.value} />
        )}
      </form.Field>
    </Grid>}
    Include:
    <Breadcrumbs separator="|">
      {showFields.map((key) => <Link onClick={() => dispatchFieldVisibility({ [key]: true })}>{key}</Link>)}
    </Breadcrumbs>
  </Grid>;
};

// completed: boolean;
//     notes: string;
//     person?: ArchetypeMapEntryBase<Person, "people"> | undefined;
//     phase: JobSearchApplicationPhaseName;
//     technical: ApplicationStageTechnicalLevel;
//     timeline: "asynchronous" | "synchronous" | number | {
//         start: number;
//         end: number;
//     };


const Stages = ({ stages, setStages }: Pick<JobSearchUpdateStageProps, 'stages' | 'setStages'>) => {
  const [editor, setEditor] = useState<'closed' | 'synchronous' | 'asynchronous'>('closed');

  const { isFirstSyncFound, props } = useMemo(() => stages.reduce(({
    isFirstSyncFound, props,
  }, stage, index) => {
    const isSync = getIsSync(stage.timeline);
    return {
      isFirstSyncFound: isSync || isFirstSyncFound,
      props: [...props, {
        deleteStage: () => setStages(stages.filter((_, i) => i !== index)),
        isFirst: index === 0,
        isFirstSync: isSync && !isFirstSyncFound,
        stage,
        setStage: (stage: Stage) => {
          const newStages = [...stages];
          newStages[index] = stage;
          setStages(newStages);
        },
      }],
    };
  }, { isFirstSyncFound: false, props: [] } as {
    isFirstSyncFound: boolean; props: StageCardProps[];
  }), [stages, setStages]);

  return <Box>
    <Grid container spacing={2} alignContent={'center'} justifyContent={'center'}>
      {props.map((props) => <StageCard {...props} />)}
      <AddStageCard setEditor={(isSynchronous) => setEditor(isSynchronous ? 'synchronous' : 'asynchronous')} />
    </Grid>
    <Grid container spacing={2}>
      Needs to be able to edit the order of stages.
      {editor !== 'closed' && 
        <StageEditor
          isFirst={props.length === 0}
          isFirstSyncFound={isFirstSyncFound}
          isNew={true}
          isSync={editor === 'synchronous'}
          setStage={(stage: Stage) => setStages([...stages, stage])}
        />
      }
    </Grid>
  </Box>
}

const CurrentPhase = ({ phase, setPhase }: Pick<JobSearchUpdateStageProps, 'phase' | 'setPhase'>) => {
  const options = useMemo(() => {
    const phaseConfig = APPLICATION_PHASE_FSM[phase];
    if (!phaseConfig) return [];
    // APPLICATION_EVENTS
    const options = [
      ...new Set(phaseConfig.next.map(({ next }) => next.map((next) => next)).flat()).values()
    ].map((next) => APPLICATION_PHASE_FSM[next]);
    return options;
  }, [phase]);

  return <>
    <LinearPhaseView currentPhase={phase} />
    {options.map(({ name, description }) => <Button onClick={() => setPhase(name)}>
      {name} ({description})
    </Button>)}
  </>;
};

export const JobSearchUpdateStage = (props: JobSearchUpdateStageProps) => {
  const [showStageEditor, setShowStageEditor] = useState(false);

  return <>
    {props.stages.length > 0 ? <>Stage progress and state</> : <CurrentPhase {...props} />}
    <Accordion summary={<>Stages</>} expanded={showStageEditor} onChange={() => setShowStageEditor(!showStageEditor)}>
      <Stages {...props} />
    </Accordion>      
  </>;
};
