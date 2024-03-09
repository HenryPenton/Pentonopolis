type EnvironmentMap = Map<string, string | undefined>;
interface IEnvironmentConfiguration {
  getEnvironmentVariables: () => EnvironmentMap;
}

export class EnvironmentConfiguration implements IEnvironmentConfiguration {
  constructor(
    private variableNames: Set<string>,
    private volatileNames: Set<string>,
  ) {
    if (this.volatileNames.size > 0) {
      throw new EnvironmentVariableUndefinedError(
        "The environment variable some-undefined-variable was undefined",
      );
    }
  }

  getEnvironmentVariables(): EnvironmentMap {
    const environmentMap: EnvironmentMap = new Map();
    this.variableNames.forEach((variableName) =>
      environmentMap.set(variableName, process.env[variableName]),
    );



    return environmentMap;
  }
}
export class EnvironmentVariableUndefinedError extends Error {}
