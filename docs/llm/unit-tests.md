# **Unit Test Generation**
**Domain:** Test Generation  
**Scope:** Creating new test files for TypeScript source files using Vitest  
**Audience:** AI coding assistant  
**Enforcement:** Hard safety rails are implemented by the orchestrator; these instructions describe expected behaviour, not permissions.

---

# 1. **Purpose**
These guidelines define how to generate **strongly‑typed, deterministic, maintainable unit tests** for TypeScript source files in this project.  
They apply only to **new test creation**, not refactoring or coverage improvement.

---

# 2. **General Principles**

### 2.1 Determinism  
Tests must be reproducible, stable, and free of randomness unless explicitly mocked.

### 2.2 Strong typing  
All tests must be fully type‑checked.  
No `any`, no implicit `unknown`, no untyped mocks.

### 2.3 Minimal surface area  
Tests should cover behaviour, not implementation details.

### 2.4 No source modification  
Do **not** modify source files unless explicitly instructed.  
If a test reveals a design issue, leave a comment in the test file suggesting improvements.

### 2.5 One file at a time  
Assume the orchestrator provides exactly one source file and one writable test file.  
Do not create additional files.

---

# 3. **Test File Structure**

### 3.1 File naming  
The orchestrator will provide the correct test file path.  
Do not rename or create additional files.

### 3.2 Imports  
- Import the module under test using **relative paths**.  
- Import types explicitly when used.  
- Import Vitest APIs individually (e.g., `import { describe, it, expect } from 'vitest'`).

### 3.3 Test layout  
Use this structure:

```ts
import { describe, it, expect } from 'vitest';
import { <exports> } from '<relative-path>';

describe('<module name>', () => {
  describe('<function or class name>', () => {
    it('should <expected behaviour>', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 3.4 No snapshot tests  
Avoid snapshot testing unless explicitly requested.

---

# 4. **Coverage Requirements**

### 4.1 Minimum coverage  
Aim for **100% coverage** of the provided file unless impossible due to external dependencies.

### 4.2 Branch coverage  
Cover all branches, including:

- success paths  
- error paths  
- edge cases  
- boundary conditions  

### 4.3 Unreachable code  
If code appears unreachable, note it in a comment.

---

# 5. **Mocking Rules**

### 5.1 Only mock what you must  
Prefer real behaviour unless:

- the function interacts with external systems  
- the function performs I/O  
- the function uses timers  
- the function depends on randomness  
- the function depends on global state  

### 5.2 Typed mocks  
All mocks must be typed.  
Examples:

```ts
const mockFn: jest.MockedFunction<typeof originalFn> = vi.fn();
```

or

```ts
const mockDep: Partial<DependencyType> = { method: vi.fn() };
```

### 5.3 No monkey‑patching  
Do not modify global objects unless explicitly required.

---

# 6. **Error Handling Tests**

### 6.1 Throwing functions  
Use:

```ts
expect(() => fn(badInput)).toThrowError(<expected>);
```

### 6.2 Async errors  
Use:

```ts
await expect(asyncFn(badInput)).rejects.toThrowError(<expected>);
```

---

# 7. **Type Safety Requirements**

### 7.1 Type‑checked tests  
All tests must pass `tsc --noEmit`.

### 7.2 Import types explicitly  
Never rely on inferred types from values.

### 7.3 Validate type behaviour  
Where relevant, include type‑level tests using `// @ts-expect-error` or `// @ts-expect-no-error`.

Example:

```ts
// @ts-expect-error invalid input
fn('wrong-type');
```

---

# 8. **Test Behaviour Expectations**

### 8.1 Behaviour‑driven  
Tests should describe *what* the function does, not *how* it does it.

### 8.2 Minimal mocking  
Mock only what is necessary to isolate the unit.

### 8.3 No duplication  
Avoid repeating setup logic; use helper functions inside the test file if needed.

---

# 9. **Comments and Suggestions**

### 9.1 Suggest improvements  
If the source file has:

- unclear behaviour (including cases inconsistent with source-code comments)
- ambiguous types  
- unreachable branches  
- inconsistent naming  
- missing edge‑case handling  

…add a comment at the bottom of the test file:

```ts
// Suggestion: <explanation>
```

Do not modify the source file unless explicitly instructed.

---

# 10. **Forbidden Actions**

The following actions must never be taken:

- Creating additional files  
- Modifying source files  
- Writing outside the provided test file  
- Using untyped mocks  
- Using `any`  
- Using snapshot tests  
- Importing from absolute filesystem paths (absolute module paths of the format `@/x/y/z` is fine).
- Changing project configuration  
- Running shell commands (or assuming shell output)  
- Loading unrelated files unless explicitly opened by the orchestrator  

---

# 11. **Assumptions**

- The orchestrator ensures the test file exists and is writable.  
- The orchestrator ensures the source file is valid and unchanged.  
- The orchestrator handles unused‑file filtering and coverage analysis.  
- The orchestrator enforces write‑scope.  
- The orchestrator may provide additional context (e.g., types, related files).  
