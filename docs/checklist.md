# Code Level Checklist

This functions as a reminder and documentation for the purposes of easy language model access, since it can't read my mind (yet... I mean, can you imagine the security issues?).

## In Progress

Work which has already started.

### IPC -> TRPC Migration

- All IPC calls should ultimately go through the latest tRPC-related patterns, as they are much more maintainable.
- For now, the existing calls don't cause problems with other parts of the application.
- Maintenance of the legacy IPC layer should result in migrations of those functions.
- New TRPC implementation can be traced from `./src/trpc`.
- Legacy IPC implementation can be traced from `./src/ipc`.

## Actionable

Work which is ready to start.

## Scoping

Work which needs thought or experimentation.

### AI Model Orchestration

Ideally the model would be chosen based on what's best for the job and what's available.

Need a list of models that are suitable to the job.

There will ultimately need to be room for running a local model when the internet isn't available and when the laptop has resources. If the criteria isn't supported, add to a queue. There needs to be the option where the user (likely me) simply clicks a button that comes up as available when there are items in the queue which forces that item to run right now regardless of constraints.

## Done

It's good to have a list of your achievements.
