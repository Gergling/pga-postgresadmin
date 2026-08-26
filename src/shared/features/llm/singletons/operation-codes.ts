const getFullyQualifiedCode = (
  featureName: string, operationName: string
) => `${featureName}:${operationName}`;

class FeatureOperationCodeConfig {
  private static operationCodes = new Map<string, FeatureOperationCodeConfig>();
  private operationCodes = new Map<string, string>();

  constructor(private featureName: string, operations: string[]) {
    operations.forEach((operationName) => this.operationCodes.set(
      operationName, getFullyQualifiedCode(featureName, operationName)
    ));
    FeatureOperationCodeConfig.operationCodes.set(featureName, this);
  }
  static hasFeature(featureName: string) {
    return FeatureOperationCodeConfig.operationCodes.has(featureName);
  }
  static getFeature(featureName: string) {
    const feature = FeatureOperationCodeConfig.operationCodes.get(featureName);
    if (!feature) {
      throw new Error(`Codes for feature name "${featureName}" do not exist. Has it been configured?`);
    }
    return feature;
  }
  getCode(operationName: string) {
    const code = this.operationCodes.get(operationName);
    if (!code) {
      throw new Error(`Operation name "${operationName}" has not been registered for feature "${this.featureName}"`);
    }
    return code;
  }
  setCode(operationName: string) {
    if (this.operationCodes.has(operationName)) {
      throw new Error(`Operation name "${operationName}" already exists for feature "${this.featureName}"`);
    }
    this.operationCodes.set(operationName, getFullyQualifiedCode(this.featureName, operationName));
    return this;
  }
}

/**
 * Ideally run this from inside @/shared/features/*.
 * @param featureName 
 */
export const configureValidOperationCodes = (
  featureName: string,
  operations?: string[]
) => {
  if (FeatureOperationCodeConfig.hasFeature(featureName)) {
    throw new Error(`Feature name "${featureName}" already exists and should only be configured once. Search files for configureValidOperationCodes('${featureName}')`);
  }
  return new FeatureOperationCodeConfig(featureName, operations ?? []);
}

export const getOperationCodes = (
  featureName: string
) => FeatureOperationCodeConfig.getFeature(featureName);
