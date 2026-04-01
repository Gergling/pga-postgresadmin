# **Commit Message Generation**
**Domain:** Source Control
**Scope:** Generating a descriptive commit message for staged changes
**Audience:** AI coding assistant
**Enforcement:** Hard safety rails are implemented by the orchestrator; these instructions describe expected behaviour, not permissions.

Generate a semantic commit message for the staged changes.

Rules:
- Use one of: feat:, fix:, refactor:, test:, chore:, docs:, perf:
- Use imperative mood (“Add…”, “Fix…”, “Refactor…”)
- Keep the subject line under 72 characters
- Summarise the intent of the change
- If the change is only tests, use test:
- If the change is only docs, use docs:
