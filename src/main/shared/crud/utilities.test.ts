import { describe, it, expect } from 'vitest';
import { summarise, toModel } from './utilities';
import { IdProp } from '../../../shared/lib/typesaurus';

describe('utilities', () => {
  describe('summarise', () => {
    interface TestData extends IdProp<string> {
      name: string;
      age: number;
      isActive: boolean;
    }

    const data: TestData = {
      id: 'user_123' as TestData['id'],
      name: 'John Doe',
      age: 30,
      isActive: true,
    };

    it('should return an object containing the id and the specified keys', () => {
      const result = summarise(data, ['name', 'isActive']);

      expect(result).toEqual({
        id: 'user_123',
        name: 'John Doe',
        isActive: true,
      });
      // Ensure excluded keys are not present
      expect(result).not.toHaveProperty('age');
    });

    it('should return only the id when an empty keys array is provided', () => {
      const result = summarise(data, []);

      expect(result).toEqual({ id: 'user_123' });
      expect(Object.keys(result)).toHaveLength(1);
    });

    it('should handle a single key correctly', () => {
      const result = summarise(data, ['age']);

      expect(result).toEqual({
        id: 'user_123',
        age: 30,
      });
    });

    it('should correctly include the id even if "id" is explicitly passed in the keys array', () => {
      // TypeScript allows this as 'id' is a key of T
      const result = summarise(data, ['id', 'name']);

      expect(result).toEqual({
        id: 'user_123',
        name: 'John Doe',
      });
      expect(Object.keys(result)).toHaveLength(2);
    });
  });

  describe('toModel', () => {
    it('should remove the id property from a persistent record', () => {
      const record = {
        id: 'record_abc' as IdProp<string>['id'],
        title: 'Document Title',
        version: 1,
      };

      const result = toModel(record);

      expect(result).toEqual({
        title: 'Document Title',
        version: 1,
      });
      expect(result).not.toHaveProperty('id');
    });

    it('should return an empty object when only an id is present', () => {
      const input = { id: 'only_id' as IdProp<string>['id'] };
      const result = toModel(input);

      expect(result).toEqual({});
    });

    it('should return the original properties when no id is present', () => {
      const input = {
        role: 'admin',
        permissions: ['read', 'write'],
      };

      // Testing logic where the object matches T but satisfies the intersection with Optional id
      const result = toModel(input);

      expect(result).toEqual({
        role: 'admin',
        permissions: ['read', 'write'],
      });
    });

    it('should not affect nested properties named id', () => {
      const input = {
        id: 'parent_id' as IdProp<string>['id'],
        child: {
          id: 'child_id',
          name: 'Nested',
        },
      };

      const result = toModel(input);

      expect(result).toEqual({
        child: {
          id: 'child_id',
          name: 'Nested',
        },
      });
      expect(result.child.id).toBe('child_id');
    });
  });
});

// Suggestion: The 'summarise' function signature returns 'T', which implies the full original object type is returned.
// However, the implementation returns a partial object containing only 'id' and the chosen 'keys'.
// To improve type safety for consumers, consider changing the return type to something like:
// Pick<T, 'id' | K[number]> where K is the keys array.

// Suggestion: The 'toModel' function uses 'model as T'. This cast is necessary because the rest-element 
// destructuring pattern doesn't automatically satisfy the generic constraint 'T' in this intersection 
// context, but it relies on the caller correctly identifying the model's shape.