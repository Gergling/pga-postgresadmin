export const dateRangeValidator = (
  start: Date | null,
  end: Date | null,
  {
    required,
  }: {
    required: {
      start: boolean;
      end: boolean;
    };
  } = {
    required: {
      start: true,
      end: true,
    }
  },
) => {
  if (start === null && required.start) return 'Start is required';
  if (end === null && required.end) return 'End is required';

  if (start === null || end === null) return;

  if (start.getTime() >= end.getTime()) return 'Start must be before end';

  return;
};
