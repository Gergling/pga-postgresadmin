# Code Level Checklist

This functions as a reminder and documentation for the purposes of easy language model access, since it can't read my mind (yet... I mean, can you imagine the security issues?).

## In Progress

Work which has already started.

### IPC -> TRPC Migration

I got bored with having to make three different complicated copypasta changes to implement a new IPC call, so I put in a library.

The library works well enough. A notable limitation is that the subscription functionality is deprecated and expected to be removed in the next major RPC version. Unfortunately the next version's subscription functionality (a simple generator function instead of a callback-based iterator instance) wasn't compatible with something fairly fundamental to electron, and I wasn't in the mood to run around in circles trying to fix it, so that's out of scope for now. The deprecated subscription functionality works fine.

Completion will be achieved when the legacy IPC code is no longer used.

- All IPC calls should ultimately go through the latest tRPC-related patterns, as they are much more maintainable.
- For now, the existing calls don't cause problems with other parts of the application.
- Maintenance of the legacy IPC layer should result in migrations of those functions.
- New TRPC implementation can be traced from `./src/trpc`.
- Legacy IPC implementation can be traced from `./src/ipc`.

### Renderer Navigation Refactor

Renderer routing configuration is at the wrong level. It's in shared which should be below features, but references features.

Ultimately routing config should be moved to the `app` and `views` levels, with feature-specific routes configured within their respective features.

- `shared`: Includes navigation config utility functions and types.
- `feature`: Feature-specific routing config, using utilities and types from `shared`.
- `views`: Root-level routing config, using utilities and types from `shared` and importing `feature` routing configs. Also has the `NavigationProvider`.
- `app`: Imports the `NavigationProvider` in `views` for the provider list.

#### Tasks

- [X] Move Root routing config to the top level.
- [ ] Move everything out of `./src/renderer/shared/navigation/constants` into their respective feature folders.

### Production Mode

Using the application will be easier if there is a "production mode" to run it in. That way I can run the production version while modifying (and potentially breaking) the dev version. That means I can use the project and task functionality (such as they are) on this very project.

#### Tasks

- [X] Settings page to replace environment variables. Must persist settings in form.
- [X] Encryption for sensitive settings (e.g. passwords and API keys). Must decrypt into form.
- [X] Functionally-orient database to use settings instead of environment variables. Must be able to access database.
- [ ] Gemini needs to use settings API key instead of environment variables. Must use key (other Gemini failures out of scope).
- [ ] Update email to use settings. Since we can assume email is defunct anyway for now, just put in the foundation code to check this off.
- [ ] (Optional) Consider backing up some settings to firebase (other than firebase credentials, obvs). Resetting the settings must reload whatever is available from Firebase.

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
