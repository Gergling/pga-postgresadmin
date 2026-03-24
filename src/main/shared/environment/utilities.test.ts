import { describe, it, expect, vi, beforeEach } from 'vitest';
import settings from 'electron-settings';
import { getEnvironment, setEnvironment } from './utilities';
import { ENVIRONMENT_SETTINGS_KEY, ENVIRONMENTS } from './constants';
import { EnvironmentProps } from './types';

// Mock electron-settings
vi.mock('electron-settings', () => ({
  default: {
    getSync: vi.fn(),
    setSync: vi.fn(),
  },
}));

describe('src/main/shared/environment/utilities.ts', () => {
  describe('getEnvironment', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return the stored environment if it is valid', () => {
      // Arrange
      const validEnv = ENVIRONMENTS[0] as EnvironmentProps;
      vi.mocked(settings.getSync).mockReturnValue(validEnv);

      // Act
      const result = getEnvironment();

      // Assert
      expect(result).toBe(validEnv);
      expect(settings.getSync).toHaveBeenCalledWith(ENVIRONMENT_SETTINGS_KEY);
    });

    it('should return "dev" if the stored value is null', () => {
      // Arrange
      vi.mocked(settings.getSync).mockReturnValue(null);

      // Act
      const result = getEnvironment();

      // Assert
      expect(result).toBe('dev');
    });

    it('should return "dev" if the stored value is not present in the ENVIRONMENTS array', () => {
      // Arrange
      vi.mocked(settings.getSync).mockReturnValue('invalid-environment-name');

      // Act
      const result = getEnvironment();

      // Assert
      expect(result).toBe('dev');
    });

    it('should return "dev" if the stored value is an empty string', () => {
      // Arrange
      vi.mocked(settings.getSync).mockReturnValue('');

      // Act
      const result = getEnvironment();

      // Assert
      expect(result).toBe('dev');
    });
  });

  describe('setEnvironment', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should call settings.setSync with the correct key and value', () => {
      // Arrange
      const envToSet = (ENVIRONMENTS[1] ?? ENVIRONMENTS[0]) as EnvironmentProps;

      // Act
      setEnvironment(envToSet);

      // Assert
      expect(settings.setSync).toHaveBeenCalledWith(ENVIRONMENT_SETTINGS_KEY, envToSet);
    });
  });
});

// Suggestion: The use of 'as string[]' and 'as EnvironmentProps' in getEnvironment suggests that the ENVIRONMENTS constant might not be strictly typed as a Readonly array or the GetEnvironment type definition is slightly decoupled from the constant. Using a const assertion (as const) on ENVIRONMENTS would allow for better type inference without casting.