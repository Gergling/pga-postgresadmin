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

**Pareto Progress**: 5%

#### Tasks

- [X] Settings page to replace environment variables. Must persist settings in form.
- [X] Encryption for sensitive settings (e.g. passwords and API keys). Must decrypt into form.
- [X] Functionally-orient database to use settings instead of environment variables. Must be able to access database.
- [X] Gemini needs to use settings API key instead of environment variables. Must use key (other Gemini failures out of scope).
- Implement Github Actions build mechanism because the asynchronicity of the production workflow is more convenient. The `npm run make` can take 45 minutes locally.
  - [X] Tag from validation workflow when package.json version is pushed with a version number that has no tag.
  - [X] Create a workflow for build which triggers manually.
  (put in the steps you had to go through so far)
  - Build workflow should generate a release artifact.
    - [X] Implement electron-vite. Completion is a working development-mode application.
    - [X] Implement electron-vite's beta. Completion is a working development-mode application.
    - [X] Get `make` working to prove a build will work at all.
    - [X] Fix production build so it's not a white background.
    - [ ] Switch off dev features in production build.
  - [ ] Build workflow should trigger from a new tag created.
- Self-downloading mechanism, in which the latest build alerts IF of a higher version than the current interface build.
  - [ ] Component in Settings should check github for releases and provide a version for the latest.
  - [ ] This component should update when the app is brought into focus.
  - [ ] Component should include a button to download the latest build.
  - [ ] Component should show current version and latest version if different or just say "is latest version" if not.
  - [ ] Download operation should include any renaming and running.
- [ ] Update email to use settings. Since we can assume email is defunct anyway for now, just put in the foundation code to check this off.
- [ ] (Optional) Consider backing up some settings to firebase (other than firebase credentials, obvs). Resetting the settings must reload whatever is available from Firebase. This is optional because the local storage is related to the project name, which is unlikely to change.


### AI Model Orchestration

Ideally the model would be chosen based on what's best for the job and what's available.

Need a list of models that are suitable to the job.

There will ultimately need to be room for running a local model when the internet isn't available and when the laptop has resources. If the criteria isn't supported, add to a queue. There needs to be the option where the user (likely me) simply clicks a button that comes up as available when there are items in the queue which forces that item to run right now regardless of constraints.

#### Parameters

Parameters should be considered out of scope since the current use-cases are pretty much just any available language model.

- Preferences
  - (?) Local/Remote: Undefined means no preference.
- Requirements
  - (?) Local/Remote: Undefined means no requirement.

#### Inputs

- System resources
- Internet availability
- Available context window size for model
- Prompt size in characters

#### Token Hueristics

- Assuming a token is 3-4 characters.
- Prompt characters / 3 and higher is "red".
- Prompt characters / 4 and lower is "green".
- The rest is "yellow".

#### Logic

- Needs requirements and preferences.
- Requirements are things like "not this model" and will be used to filter.
- Preferences are things like "biggest context window" and will be used to sort.

- If no internet, local is a requirement.
- If no system resources, remote is the preference.
- If no internet OR system resources, should probably check with the user first. Would ideally looking into ensuring it doesn't eat the whole processor, but just waits until available or something.

**Pareto Progress**: 6%

#### Tasks

- Shared orchestration functionality. This is abstracted from specific models and intended to choose and run models based on what is suitable.
  - [X] Source-level function template for picking a model asynchronously which returns a list of standardised model properties for that source.
  - [X] Source-level function template for running the model to generate text. For the orchestrator implementation, only text is within scope.
  - [X] Transformation mechanics and handling the (probably string) output against a zod template that was passed in.
- [X] Gemini configuration in libs. This is a source-level specific set up using Gemini and the appropriate API key.
- [X] Configuration setup runner which is a factory for taking the source-level configurations.
- Local runner configuration.
  - [X] Ollama requires no docker (although it can have docker).
  - [ ] Whether to use local once spun up should be dependent on the system CPU/memory output.
  - [ ] Choose thresholds for memory and CPU. E.g. memory can be at <85 (including 80-85 yellow zone), 85-95 (red zone, and it asks) and beyond that it vetoes. CPU can be 10%-15%.

## Actionable

Work which is ready to start.

### Project Zod Templates

Explicit format output means commit message generation uses JSON formats. These need to be converted to Zod templates for portability and fed into the language models appropriately.

## Scoping

Work which needs thought or experimentation.

### Task Nesting

The idea is to open a task detail view and see the child tasks in a table. The children of those tasks should appear under their parents, but ideally indented or something. The maximum display depth can be limited, but there should be no storage depth limit.

This will need a system to keep the firebase calls efficient when getting data for a whole task tree. One simple way to do this is with summary data. A task can keep track of all ancestor ids and all descendant ids. That way, a secondary call can be made to batch-request the related tasks.

### Project Tasks

This is more about establishing a relationship between the concept of a project (which is largely SMART) and the concept of a task.

A project essentially has two phases: Setup and maintenance. Some examples:
- Neon Blood Icons
  - Setup:
    - Display and license icons
    - Future collection release plans
  - Maintenance:
    - Modern package technology for stability and security
    - Routine review of trends, the market/community and planning the next season's collection.
- ACX
  - Setup: Make an account
  - Maintenance: Do some recordings

### Project Commit Message Caching

This is to solve the problem of waiting on the AI to generate responses while
doing other things.

The idea is to take a hash of staged commit changes and evaluate it when the project is opened up. A commit message object is stored against the project, along with the hashed string. If the project's staged files hash to the same string, the commit message is still valid. Otherwise we're done with it. Ideally a successful commit should delete the cache anyway. Ideally the cache is on the main side, probably using electron settings.

This means it should be possible to store commit messages against multiple projects while awaiting feedback concurrently.

#### Tasks
- [ ] Implement an electron setting for project commit message objects. While this could be an object, deletion might be easier via an array. The record key should be the project name. If the has doesn't match, the output object can simply omit the key for the project.
- [ ] Implement a hashing function that transforms the staged code. For consistency, it should be based against the function which extracts the staged code.
- [ ] Ideally, getting the staged code, hashing, comparing with the stored commit message for the project, and deleting if the hash doesn't match, all happen within a single function which runs before the language model runs. That way, the language model doesn't need to run if there is a legitimate commit message already.
- [ ] If the language model runs, the output can be saved to the electron settings. This can simply override, but TBH it shouldn't exist at this point because it should have been deleted or used instead.
- [ ] Cached or not, the output should go through the IPC.

## Done

It's good to have a list of your achievements.
