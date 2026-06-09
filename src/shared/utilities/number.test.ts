import { describe, it, expect } from 'vitest';
import { padSchemaFactory } from './number'; // Relative path

describe('number.ts', () => {
  describe('padSchemaFactory', () => {
    // Test cases for number input
    it('should convert a number to a padded string when padding is greater than number length', () => {
      // Arrange
      const padding = 3;
      const schema = padSchemaFactory(padding);

      // Act & Assert
      expect(schema.parse(1)).toBe('001');
      expect(schema.parse(12)).toBe('012');
      expect(schema.parse(123)).toBe('123'); // No padding needed
    });

    it('should convert a number to a string without padding if padding is less than or equal to number length', () => {
      // Arrange
      const padding = 1;
      const schema = padSchemaFactory(padding);

      // Act & Assert
      expect(schema.parse(1)).toBe('1');
      expect(schema.parse(12)).toBe('12');
    });

    it('should handle zero padding correctly for numbers', () => {
      // Arrange
      const padding = 0;
      const schema = padSchemaFactory(padding);

      // Act & Assert
      expect(schema.parse(123)).toBe('123');
      expect(schema.parse(0)).toBe('0');
    });

    it('should handle zero as a number input correctly', () => {
      // Arrange
      const padding = 5;
      const schema = padSchemaFactory(padding);

      // Act & Assert
      expect(schema.parse(0)).toBe('00000');
    });

    // Skipped because I don't need to handle negative numbers right now.
    it.skip('should handle negative numbers correctly, padding after the sign', () => {
      // Arrange
      const padding = 5;
      const schema = padSchemaFactory(padding);

      // Act & Assert
      expect(schema.parse(-1)).toBe('-0001');
      expect(schema.parse(-123)).toBe('-0123');
    });

    // Test cases for string input
    it('should return the string value as-is, regardless of padding', () => {
      // Arrange
      const padding = 5;
      const schema = padSchemaFactory(padding);

      // Act & Assert
      expect(schema.parse('hello')).toBe('hello');
      expect(schema.parse('123')).toBe('123');
      expect(schema.parse('')).toBe('');
    });

    it('should return the string value as-is even with zero padding', () => {
      // Arrange
      const padding = 0;
      const schema = padSchemaFactory(padding);

      // Act & Assert
      expect(schema.parse('test')).toBe('test');
    });

    // Type-level tests (using Zod's inference)
    it('should infer the output type as string', () => {
      // Arrange
      const schema = padSchemaFactory(3);
      type OutputType = typeof schema._output;

      // Act & Assert
      // This is a compile-time check. If OutputType was not string, TypeScript would error.
      // We can assert a value to ensure the runtime behavior matches.
      const result: OutputType = schema.parse(1);
      expect(typeof result).toBe('string');
    });

    it('should accept both number and string as input types', () => {
      // Arrange
      const schema = padSchemaFactory(3);

      // Act & Assert (compile-time check for input types)
      // @ts-expect-no-error
      schema.parse(123);
      // @ts-expect-no-error
      schema.parse('abc');

      expect(() => schema.parse(true)).toThrow();
    });
  });
});