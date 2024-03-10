type EnvironmentMap<NonCritical, Critical> = {
  [Property in keyof NonCritical]?: string;
} & {
  [Property in keyof Critical]: string;
};

export type EnvironmentVariableDefinition = {
  name: string;
};

export type VariableSet<UserDefinitions> = {
  [Property in keyof UserDefinitions]: EnvironmentVariableDefinition;
};

interface IEnvironmentConfiguration<NonCritical, Critical> {
  getEnvironmentVariables: () => EnvironmentMap<NonCritical, Critical>;
  getCriticalEnvironmentVariable: (
    variableName: keyof Critical,
  ) => EnvironmentMap<NonCritical, Critical>[keyof Critical];
}

export class EnvironmentConfiguration<NonCritical, Critical>
  implements IEnvironmentConfiguration<NonCritical, Critical>
{
  private environmentMap: EnvironmentMap<NonCritical, Critical> =
    {} as EnvironmentMap<NonCritical, Critical>;

  constructor(
    private nonCriticalVariables: VariableSet<NonCritical>,
    private criticalVariables: VariableSet<Critical>,
  ) {
    this.checkCriticalEnvironmentVariables();
    this.buildNonCriticalEnvironmentMap();
    this.buildCriticalEnvironmentMap();
  }

  private checkCriticalEnvironmentVariables(): void {
    const erroredVariables: string[] = [];

    Object.values(this.criticalVariables).forEach((objectValue) => {
      const criticalEntry = objectValue as EnvironmentVariableDefinition;
      const variableFromEnv = process.env[criticalEntry.name];

      if (!variableFromEnv) erroredVariables.push(criticalEntry.name);
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

  private buildCriticalEnvironmentMap(): void {
    Object.entries(this.criticalVariables).forEach((entry) => {
      const userGivenName = entry[0];
      const criticalEntry = entry[1] as EnvironmentVariableDefinition;

      this.environmentMap = {
        ...this.environmentMap,
        [userGivenName]: process.env[criticalEntry.name],
      };
    });
  }

  private buildNonCriticalEnvironmentMap(): void {
    Object.entries(this.nonCriticalVariables).forEach((entry) => {
      const userGivenName = entry[0];
      const nonCriticalEntry = entry[1] as EnvironmentVariableDefinition;

      this.environmentMap = {
        ...this.environmentMap,
        [userGivenName]: process.env[nonCriticalEntry.name],
      };
    });
  }

  getEnvironmentVariables(): EnvironmentMap<NonCritical, Critical> {
    return this.environmentMap;
  }

  getCriticalEnvironmentVariable(
    variableName: keyof Critical,
  ): EnvironmentMap<NonCritical, Critical>[keyof Critical] {
    return this.environmentMap[variableName];
  }

  getNonCriticalEnvironmentVariable(
    variableName: keyof NonCritical,
  ): EnvironmentMap<NonCritical, Critical>[keyof NonCritical] {
    return this.environmentMap[variableName];

  }
}
export class EnvironmentVariableUndefinedError extends Error {}
