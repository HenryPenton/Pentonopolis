type EnvironmentMap = Map<string, string | undefined>;
interface IEnvironmentConfiguration {
  getEnvironmentVariables: () => EnvironmentMap;
}

export class EnvironmentConfiguration implements IEnvironmentConfiguration {
  private environmentMap: EnvironmentMap = new Map();

  constructor(
    private variableNames: Set<string>,
    private volatileNames: Set<string>,
  ) {
    this.checkVolatileEnvironmentVariables();
    this.buildEnvironmentMap();
  }

  private checkVolatileEnvironmentVariables(): void {
    const erroredVariables: string[] = [];
    this.volatileNames.forEach((volatileName) => {
      const variableFromEnv = process.env[volatileName];
      if (!variableFromEnv) erroredVariables.push(volatileName);
    });

    const totalErrors = erroredVariables.length;

    if (totalErrors === 1) {
      throw new EnvironmentVariableUndefinedError(
        `The environment variable ${erroredVariables[0]} was undefined`,
      );
    }

    if (totalErrors > 1) {
      const lastName = erroredVariables.pop();
      const errorString = erroredVariables.join(", ") + ` and ${lastName}`;
      throw new EnvironmentVariableUndefinedError(
        `The environment variables ${errorString} was undefined`,
      );
    }
  }

  private buildEnvironmentMap(): void {
    this.variableNames.forEach((variableName) =>
      this.environmentMap.set(variableName, process.env[variableName]),
    );

    this.volatileNames.forEach((volatileName) =>
      this.environmentMap.set(volatileName, process.env[volatileName]),
    );
  }

  getEnvironmentVariables(): EnvironmentMap {
    return this.environmentMap;
  }
}
export class EnvironmentVariableUndefinedError extends Error {}
