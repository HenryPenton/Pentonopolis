type SystemConfiguration<NonCritical, Critical> = {
  [Property in keyof NonCritical]?: string;
} & {
  [Property in keyof Critical]: string;
};

export type VariableSet<UserDefinitions> = {
  [Property in keyof UserDefinitions]: string;
};

interface IConfiguration<NonCritical, Critical> {
  getConfigurationVariables: () => SystemConfiguration<NonCritical, Critical>;
  getConfigurationVariable: (
    variableName: keyof Critical,
  ) => SystemConfiguration<NonCritical, Critical>[keyof Critical];
}

export class Configuration<NonCritical, Critical>
  implements IConfiguration<NonCritical, Critical>
{
  private environment: SystemConfiguration<NonCritical, Critical> =
    {} as SystemConfiguration<NonCritical, Critical>;

  constructor(
    private nonCriticalEnvironmentVariables: VariableSet<NonCritical>,
    private criticalEnvironmentVariables: VariableSet<Critical>,
    private dataSources: { [key: string]: string | undefined }[],
  ) {
    this.detectDuplicates();
    this.ensureCriticalEnvironmentVariablesExist();
    this.buildNonCriticalEnvironmentMap();
    this.buildCriticalEnvironmentMap();
  }

  private detectDuplicates(): void {
    const criticalKeys = Object.keys(this.criticalEnvironmentVariables);
    const nonCriticalKeys = Object.keys(this.nonCriticalEnvironmentVariables);

    const totalSize = criticalKeys.length + nonCriticalKeys.length;
    const deduplicatedSize = new Set([...criticalKeys, ...nonCriticalKeys])
      .size;

    if (deduplicatedSize !== totalSize) {
      throw new DuplicateConfigKeyError(
        "Two or more variables have been defined with the same name.",
      );
    }
  }

  private ensureCriticalEnvironmentVariablesExist(): void {
    const erroredVariables: string[] = [];

    Object.values(this.criticalEnvironmentVariables).forEach((objectValue) => {
      const criticalEntry = objectValue as string;

      let variableFromEnv;

      for (const dataSource of this.dataSources) {
        const currentIterationValue = dataSource[criticalEntry];
        if (currentIterationValue) {
          variableFromEnv = dataSource[criticalEntry];
        }
      }

      if (!variableFromEnv) erroredVariables.push(criticalEntry);
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
        `The environment variables ${errorString} were undefined`,
      );
    }
  }

  private buildEnvironmentVariableMap(
    variables: VariableSet<Critical | NonCritical>,
  ): void {
    Object.entries(variables).forEach(([userGivenName, entry]) => {
      for (const dataSource of this.dataSources) {
        const currentIterationValue = dataSource[entry as string];
        this.environment = {
          ...this.environment,
          [userGivenName]: dataSource[entry as string],
        };
        if (currentIterationValue) {
          break;
        }
      }
    });
  }

  private buildCriticalEnvironmentMap(): void {
    this.buildEnvironmentVariableMap(this.criticalEnvironmentVariables);
  }

  private buildNonCriticalEnvironmentMap(): void {
    this.buildEnvironmentVariableMap(this.nonCriticalEnvironmentVariables);
  }

  getConfigurationVariables(): SystemConfiguration<NonCritical, Critical> {
    return this.environment;
  }

  getConfigurationVariable(
    variableName: keyof Critical,
  ): SystemConfiguration<NonCritical, Critical>[keyof Critical] {
    return this.environment[variableName];
  }

  getConfigurationVariableOrUndefined(
    variableName: keyof NonCritical,
  ): SystemConfiguration<NonCritical, Critical>[keyof NonCritical] {
    return this.environment[variableName];
  }
}

export class EnvironmentVariableUndefinedError extends Error {}
export class DuplicateConfigKeyError extends Error {}
