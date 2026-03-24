import { describe, it, expect, vi } from 'vitest';
import { createCrudConfig } from './utilities';

describe('createCrudConfig', () => {
  it('should return the config object exactly as provided', () => {
    const mockCreate = vi.fn(async () => ({ id: '1', name: 'Test' }));
    const mockRead = vi.fn(async () => ['item1', 'item2']);
    
    const config = {
      create: {
        createItem: mockCreate,
      },
      read: {
        listItems: mockRead,
      },
      // Testing that partial definitions work (omitting update/delete)
    };

    const result = createCrudConfig(config);

    expect(result).toBe(config);
    expect(result.create?.createItem).toBe(mockCreate);
    expect(result.read?.listItems).toBe(mockRead);
    
    // Verify runtime behavior isn't altered
    expect(result.create?.createItem()).resolves.toEqual({ id: '1', name: 'Test' });
  });

  it('should handle empty configs', () => {
    const config = {};
    const result = createCrudConfig(config);
    expect(result).toEqual({});
  });
});