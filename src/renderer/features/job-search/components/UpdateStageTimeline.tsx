import { useMemo } from "react";
import { JobSearchDbSchema } from "../../../../shared/features/job-search";
import { isStageTimelineSynchronous } from "../utilities";
import { useField, useForm } from "@tanstack/react-form";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { FormControlLabel, Switch } from "@mui/material";

type Timeline = JobSearchDbSchema['base']['applications']['stages'][number]['timeline'];

const getStageTimeline = (
  { isSync, ...formTimeline }: { isSync: boolean; start: Date | null; end: Date | null; }
): Timeline => {
  const start = formTimeline.start?.getTime();
  if (isSync) {
    if (formTimeline.end) {
      if (!start) throw new Error(`It should not be possible to have no stage timeline start date defined while an end date is defined.`);
      return {
        start,
        end: formTimeline.end.getTime(),
      };
    }
    return 'synchronous';
  }
  return start || 'asynchronous';
}

export const StageTimelineEditor = ({ timeline, setTimeline }: {
  timeline: Timeline,
  setTimeline: (timeline: Timeline) => void,
}) => {
  const defaultValues = useMemo(() => {
    const isSync = isStageTimelineSynchronous(timeline);
    const isPopulated = typeof timeline !== 'string';
    if (isSync) return {
      isSync,
      start: isPopulated ? new Date(timeline.start) : null,
      end: isPopulated ? new Date(timeline.end) : null,
    };

    return {
      isSync,
      start: isPopulated ? new Date(timeline) : null,
      end: null,
    };
  }, [timeline]);

  const form = useForm({
    defaultValues,
    validators: {
      onChangeAsyncDebounceMs: 500, 
      onChangeAsync: async ({ value: { isSync, start, end } }) => {
        // For an asynchronous timeframe we only have a due time, and it's the start time for the purposes of this form.
        if (!isSync) return;

        // For a synchronous timeframe, we can have a start and end time.
        if (start && end) {
          if (start < end) return;
          return 'The end must be after the start.';
        }

        // We cannot have only one of these populated.
        if (start) return 'A synchronous application stage must also have an end time.';
        if (end) return 'A synchronous application stage must also have a start time.';

        // We can have no start or end time defined.
        return;
      },
    },
    onSubmit: ({ value }) => {
      const newTimeline = getStageTimeline(value);
      setTimeline(newTimeline);
    },
  });

  const isSync = useField({ form, name: 'isSync'});

  // TODO: Duration presets, since meetings are often 15, 30, 60 or 120 minutes.
  // These only work if there is a start time.
  // In theory, one could put in the duration preset assumed from the other aspects of the meeting type.
  // Only applies to synchronous.
  // Not worth the hassle right now.
  return <>
    <div>
      <form.Field name="isSync">
        {(field) => (<>
          - ]
          <Switch onChange={({ target: { checked } }) => field.setValue(checked)} checked={field.state.value} />
          [ ]
        </>)}
      </form.Field>
    </div>
    <FormControlLabel
      control={<div>
        <form.Field name="start">
          {(field) => (
            <DateTimePicker onChange={(date) => field.setValue(date)} value={field.state.value} />
          )}
        </form.Field>
        {isSync.state.value && <>
          <form.Field name="end">
            {(field) => (
              <TimePicker onChange={(date) => field.setValue(date)} value={field.state.value} />
            )}
          </form.Field>
        </>}
      </div>}
      label={isSync.state.value ? 'Duration' : 'Due'}
      labelPlacement="start"
    />
  </>;
};
