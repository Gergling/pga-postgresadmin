---
name: Automatic Test Coverage Agent
on:
  workflow_dispatch:
permissions:
  contents: read
  pull-requests: write
  copilot-requests: write
tools:
  - git
  - python
---

# Objective
Find any pure functions inside the `src/utils/` directory that lack 100% test coverage. 

# Instructions
1. Review the files in `src/utils/` and their matching tests in `tests/`.
2. Select exactly ONE function that needs better test coverage. 
3. Write isolated unit tests using `pytest` for that single function. Do not bundle multiple functions together.
4. Output your changes as a single, isolated Pull Request targeting the `main` branch.
