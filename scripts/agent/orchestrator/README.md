## TO DO

| Status | Value | Momentum | Scope | Description |
| --- | --- | --- | --- | --- |
| - | High | Medium | Good | Dry run mode: Prints the result but doesn't write to any source code (could leave a report though).
| - | High | Low | Ok | Import preloader: Grabs relevant imported files from source, ideally through to the full types (usually) used. This is useful because it means I won't have to go and manually handle as many types.
| - | - | - | Ok | Coverage Analysis
| - | - | - | Ok | Report: Source file-level operations status report, e.g. for LLM failures, which operates have been performed, etc. Orchestrator will need to update the report before running anything under certain circumstances. Should probably include things like a "currently running" check. Updating the report should lock it for reading. Reading a locked report should ideally trigger deadlock handling. Affected files should generally not be the subject of multiple parallel runs.
| - | - | - | Bad | Queue management: E.g. kicking off priority background processes if the battery is > 75%, or > 50% and plugged into power, isn't already already running that process (*requires status report*), resources aren't low, etc.
| Done | High | High | Excellent | Add ignore directives
| Done | High | High | Excellent | Add basic instructions
| Done | High | High | Excellent | Orchestrator: Pick a file to run based on new unit test agent.

### Possible Agents

* **Domain:** Unit Testing
  * *Behaviour:* Create New Zero-Coverage Utility Tests
    1. Picks the first file that follows these criteria:
        * Is a `utilities/*` or `utilities.ts` file.
        * Is a source-code file.
        * Has no changes and isn't new (check git).
        * Has no unit tests at `[source file name].test.ts` (file can exist but be empty).
    2. Creates a new test file named `[source file name].test.ts` using `touch` or equivalent.
    3. Run the LLM to write to test file, based on source code file.
* **Domain:** Architecture
  * *Behaviour:* Analyse Circular Dependencies
  * *Behaviour:* DRY Check
    1. Pick two files based on the following criteria:
        * Is unchanged.
        * Has no DRY check entry since the last run.
