import { describe, expect, it } from 'vitest';
import { TypesaurusCore } from 'typesaurus';
import { docMap, docsMap } from './utilities';

type Person = {
  id: TypesaurusCore.Id<'people'>;
  name: string;
  age: number;
};

describe('typesaurus utilities', () => {
  describe('docMap', () => {
    it('adds id to underlying doc data', () => {
      const doc = {
        data: { name: 'Alice', age: 30 },
        ref: { id: 'people/abc123' }
      } as { data: Omit<Person, 'id'>; ref: { id: Person['id'] } };

      const mapped = docMap<Person>(doc);

      expect(mapped).toEqual({ id: 'people/abc123', name: 'Alice', age: 30 });
    });

    it('preserves other fields', () => {
      const doc = {
        data: { name: 'Bob', age: 42 },
        ref: { id: 'people/xyz' }
      } as { data: Omit<Person, 'id'>; ref: { id: Person['id'] } };

      const mapped = docMap<Person>(doc);

      expect(mapped.name).toBe('Bob');
      expect(mapped.age).toBe(42);
      expect(mapped.id).toBe('people/xyz');
    });
  });

  describe('docsMap', () => {
    it('maps docs to items and skips null entries', () => {
      const docs = [
        {
          data: { name: 'Alice', age: 30 },
          ref: { id: 'people/abc' }
        },
        null,
        {
          data: { name: 'Bob', age: 42 },
          ref: { id: 'people/def' }
        }
      ] as Array<{ data: Omit<Person, 'id'>; ref: { id: Person['id'] } } | null>;

      const mapped = docsMap<Person>(docs);

      expect(mapped).toEqual([
        { id: 'people/abc', name: 'Alice', age: 30 },
        { id: 'people/def', name: 'Bob', age: 42 }
      ]);
    });

    it('returns empty list for all-null docs', () => {
      const mapped = docsMap<Person>([null, null]);
      expect(mapped).toEqual([]);
    });
  });
});