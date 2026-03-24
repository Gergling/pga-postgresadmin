import { describe, it, expect } from 'vitest';
import {
  validateLanguageModelResponse,
  validateLanguageModelResponseArray,
} from './validation';
import { LlmResponseSchema, LlmValidationResult } from '../types';

interface TestUser {
  id: number;
  name: string;
}

describe('validation utilities', () => {
  const userSchema: LlmResponseSchema<TestUser> = {
    id: (val: unknown): LlmValidationResult<number> => {
      if (typeof val === 'number') return { success: true, value: val };
      return { success: false, message: 'Not a number', value: 0 };
    },
    name: (val: unknown): LlmValidationResult<string> => {
      if (typeof val === 'string') return { success: true, value: val };
      return { success: false, message: 'Not a string', value: '' };
    },
  };

  describe('validateLanguageModelResponse', () => {
    it('should return success for a valid object matching the schema', () => {
      const input = { id: 1, name: 'John Doe' };
      const result = validateLanguageModelResponse(input, userSchema);

      expect(result.success).toBe(true);
      expect(result.value).toEqual(input);
    });

    it('should return failure if the input is not an object', () => {
      const result = validateLanguageModelResponse('not-an-object', userSchema);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Response is not an object');
    });

    it('should return failure if the input is null', () => {
      const result = validateLanguageModelResponse(null, userSchema);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Response is not an object');
    });

    it('should return failure if a property fails validation', () => {
      const input = { id: 'invalid-id', name: 'John Doe' };
      const result = validateLanguageModelResponse(input, userSchema);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Property 'id' invalid: Not a number");
    });

    it('should include the failed value in the result if a property fails validation', () => {
      const input = { id: 1, name: 123 };
      const result = validateLanguageModelResponse(input, userSchema);

      expect(result.success).toBe(false);
      expect(result.value).toBe('');
    });

    it('should ignore properties in the input that are not in the schema', () => {
      const input = { id: 1, name: 'John', extra: 'ignored' };
      const result = validateLanguageModelResponse(input as TestUser, userSchema);

      expect(result.success).toBe(true);
      expect(result.value).toEqual({ id: 1, name: 'John' });
      expect(result.value).not.toHaveProperty('extra');
    });
  });

  describe('validateLanguageModelResponseArray', () => {
    it('should return success for a valid array of objects', () => {
      const input = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const result = validateLanguageModelResponseArray(input, userSchema);

      expect(result.success).toBe(true);
      expect(result.value).toEqual(input);
    });

    it('should return success for an empty array', () => {
      const result = validateLanguageModelResponseArray([], userSchema);

      expect(result.success).toBe(true);
      expect(result.value).toEqual([]);
    });

    it('should return failure if the input is not an array', () => {
      const result = validateLanguageModelResponseArray({}, userSchema);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Response is not an array');
      expect(result.value).toEqual([]);
    });

    it('should return failure and specify the index if an item is invalid', () => {
      const input = [
        { id: 1, name: 'Alice' },
        { id: 'invalid', name: 'Bob' },
      ];
      const result = validateLanguageModelResponseArray(input, userSchema);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Item at index 1 invalid');
      expect(result.message).toContain("Property 'id' invalid: Not a number");
      expect(result.value).toEqual([]);
    });

    it('should return failure if an item is not an object', () => {
      const input = [{ id: 1, name: 'Alice' }, 'not-an-object'];
      const result = validateLanguageModelResponseArray(input, userSchema);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Item at index 1 invalid: Response is not an object');
    });
  });
});

// Suggestion: The `validateLanguageModelResponse` function uses `Object.keys(schema)` to iterate. 
// If the LLM response is missing a key defined in the schema, `response[key]` will be `undefined`. 
// The current implementation relies on the individual validators to handle `undefined`. 
// If a validator doesn't expect `undefined`, it might throw or behave unexpectedly. 
// Consider adding a check for missing keys if they are mandatory.