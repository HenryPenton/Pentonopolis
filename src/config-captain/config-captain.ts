type EnvironmentMap = Map<string, string | undefined>;
interface IEnvironmentConfiguration {
  getEnvironmentVariables: () => EnvironmentMap;
}

export type EnvironmentVariable = { name: string };

export class EnvironmentConfiguration implements IEnvironmentConfiguration {
  private environmentMap: EnvironmentMap = new Map();

  constructor(
    private canHaveVariables: Set<EnvironmentVariable>,
    private mustHaveVariables: Set<EnvironmentVariable>,
  ) {
    this.checkMustHaveEnvironmentVariables();
    this.buildEnvironmentMap();
  }

  private checkMustHaveEnvironmentVariables(): void {
    const erroredVariables: string[] = [];
    this.mustHaveVariables.forEach((mustHaveVariable) => {
      const variableFromEnv = process.env[mustHaveVariable.name];
      if (!variableFromEnv) erroredVariables.push(mustHaveVariable.name);
    });

    const totalErrors = erroredVariables.length;

    if (totalErrors === 1) {
      throw new EnvironmentVariableUndefinedError(
        `The environment variable ${erroredVariables[0]} was undefined`,
      );
    }

    if (totalErrors > 0) {
      const lastName = erroredVariables.pop();
      const errorString = erroredVariables.join(", ") + ` and ${lastName}`;
      throw new EnvironmentVariableUndefinedError(
        `The environment variables ${errorString} was undefined`,
      );
    }
  }

  private buildEnvironmentMap(): void {
    this.canHaveVariables.forEach((canHaveVariable) =>
      this.environmentMap.set(
        canHaveVariable.name,
        process.env[canHaveVariable.name],
      ),
    );

    this.mustHaveVariables.forEach((mustHaveVariable) =>
      this.environmentMap.set(
        mustHaveVariable.name,
        process.env[mustHaveVariable.name],
      ),
    );
  }

  getEnvironmentVariables(): EnvironmentMap {
    return this.environmentMap;
  }
}
export class EnvironmentVariableUndefinedError extends Error {}
