import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  summariseApplication,
  summariseInteraction,
  toInteractionTransfer,
  toApplicationTransfer
} from './mappers';
import { summarise } from '@main/shared/crud';
import { APPLICATION_SUMMARY_FIELDS } from '../constants';
import { JobSearchApplicationRecord, JobSearchInteractionRecord } from '@shared/features/job-search';

vi.mock('@main/shared/crud', () => ({
  summarise: vi.fn(<T>(data: T) => data),
}));

vi.mock('../constants', () => ({
  APPLICATION_SUMMARY_FIELDS: ['id', 'company', 'role'],
}));

describe('mappers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('summariseApplication', () => {
    it('should handle undefined salary', () => {
      // Casting as unknown as JobSearchApplicationRecord because providing a full record object is unnecessary 
      // for these unit tests and would lead to significant boilerplate.
      const data = {
        id: 'app-1',
        company: 'ACME',
        salary: undefined,
      } as unknown as JobSearchApplicationRecord;

      const result = summariseApplication(data);

      expect(summarise).toHaveBeenCalledWith(
        expect.objectContaining({ salary: {} }),
        APPLICATION_SUMMARY_FIELDS
      );
      expect(result.salary).toEqual({});
    });

    it('should handle numeric salary', () => {
      // Casting as unknown as JobSearchApplicationRecord because providing a full record object is unnecessary 
      // for these unit tests and would lead to significant boilerplate.
      const data = {
        id: 'app-2',
        company: 'ACME',
        salary: 50000,
      } as unknown as JobSearchApplicationRecord;

      const result = summariseApplication(data);

      expect(result.salary).toEqual({ min: 50000, max: 50000 });
    });

    it('should handle object salary', () => {
      const salary = { min: 60000, max: 80000 };
      // Casting as unknown as JobSearchApplicationRecord because providing a full record object is unnecessary 
      // for these unit tests and would lead to significant boilerplate.
      const data = {
        id: 'app-3',
        company: 'ACME',
        salary,
      } as unknown as JobSearchApplicationRecord;

      const result = summariseApplication(data);

      expect(result.salary).toEqual(salary);
    });
  });

  describe('summariseInteraction', () => {
    it('should map timeperiod.start to time and call summarise', () => {
      // Casting as unknown as JobSearchInteractionRecord because providing a full record object is unnecessary 
      // for these unit tests and would lead to significant boilerplate.
      const data = {
        id: 'int-1',
        person: 'John Doe',
        timeperiod: { start: 1672531200000 },
      } as unknown as JobSearchInteractionRecord;

      const result = summariseInteraction(data);

      expect(summarise).toHaveBeenCalledWith(
        expect.objectContaining({
          person: 'John Doe',
          time: 1672531200000,
        }),
        ['person', 'time']
      );
      expect(result).toHaveProperty('time', 1672531200000);
      // Ensure timeperiod was destructured out
      expect(result).not.toHaveProperty('timeperiod');
    });
  });

  describe('toInteractionTransfer', () => {
    it('should return the record as is', () => {
      // Casting as unknown as JobSearchInteractionRecord because providing a full record object is unnecessary 
      // for these unit tests and would lead to significant boilerplate.
      const data = {
        id: 'int-2',
        person: 'Jane Doe',
      } as unknown as JobSearchInteractionRecord;

      const result = toInteractionTransfer(data);

      expect(result).toBe(data);
    });
  });

  describe('toApplicationTransfer', () => {
    it('should map salary and return the data', () => {
      // Casting as unknown as JobSearchApplicationRecord because providing a full record object is unnecessary 
      // for these unit tests and would lead to significant boilerplate.
      const data = {
        id: 'app-4',
        salary: 75000,
        role: 'Developer',
      } as unknown as JobSearchApplicationRecord;

      const result = toApplicationTransfer(data);

      expect(result).toEqual({
        ...data,
        salary: { min: 75000, max: 75000 },
      });
    });
  });
});
