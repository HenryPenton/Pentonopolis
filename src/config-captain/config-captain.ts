type EnvironmentMap<NonCritical, Critical, Config> = {
  [Property in keyof NonCritical]?: string;
} & {
  [Property in keyof Critical]: string;
} & {
  [Property in keyof Config]: string;
};

export type EnvironmentVariableDefinition = {
  name: string;
};

export type ConfigVariableDefinition = {
  value: string;
};

export type VariableSet<UserDefinitions> = {
  strings: {
    [Property in keyof UserDefinitions]: EnvironmentVariableDefinition;
  };
};

export type ConfigSet<UserDefinitions> = {
  [Property in keyof UserDefinitions]: ConfigVariableDefinition;
};

interface IEnvironmentConfiguration<NonCritical, Critical, Config> {
  getEnvironmentVariables: () => EnvironmentMap<NonCritical, Critical, Config>;
  getStringVariable: (
    variableName: keyof Critical,
  ) => EnvironmentMap<NonCritical, Critical, Config>[keyof Critical];
  getStringVariableOrUndefined: (
    variableName: keyof NonCritical,
  ) => EnvironmentMap<NonCritical, Critical, Config>[keyof NonCritical];
}

export class EnvironmentConfiguration<NonCritical, Critical, Config>
  implements IEnvironmentConfiguration<NonCritical, Critical, Config>
{
  private environmentMap: EnvironmentMap<NonCritical, Critical, Config> =
    {} as EnvironmentMap<NonCritical, Critical, Config>;

  constructor(
    private nonCriticalVariables: VariableSet<NonCritical>,
    private criticalVariables: VariableSet<Critical>,
    private configVariables: ConfigSet<Config>,
  ) {
    this.ensureCriticalEnvironmentVariablesExist();
    this.buildNonCriticalEnvironmentMap();
    this.buildCriticalEnvironmentMap();
    this.buildConfigEnvironmentMap();
  }

  private ensureCriticalEnvironmentVariablesExist(): void {
    const erroredVariables: string[] = [];

    Object.values(this.criticalVariables.strings).forEach((objectValue) => {
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
    Object.entries(this.criticalVariables.strings).forEach((entry) => {
      const userGivenName = entry[0];
      const criticalEntry = entry[1] as EnvironmentVariableDefinition;

      this.environmentMap = {
        ...this.environmentMap,
        [userGivenName]: process.env[criticalEntry.name],
      };
    });
  }

  private buildNonCriticalEnvironmentMap(): void {
    Object.entries(this.nonCriticalVariables.strings).forEach((entry) => {
      const userGivenName = entry[0];
      const nonCriticalEntry = entry[1] as EnvironmentVariableDefinition;

      this.environmentMap = {
        ...this.environmentMap,
        [userGivenName]: process.env[nonCriticalEntry.name],
      };
    });
  }

  private buildConfigEnvironmentMap(): void {
    Object.entries(this.configVariables).forEach((entry) => {
      const userGivenName = entry[0];
      const configEntry = entry[1] as ConfigVariableDefinition;

      this.environmentMap = {
        ...this.environmentMap,
        [userGivenName]: configEntry.value,
      };
    });
  }

  getEnvironmentVariables(): EnvironmentMap<NonCritical, Critical, Config> {
    return this.environmentMap;
  }

  getStringVariable(
    variableName: keyof Critical,
  ): EnvironmentMap<NonCritical, Critical, Config>[keyof Critical] {
    return this.environmentMap[variableName];
  }

  getStringVariableOrUndefined(
    variableName: keyof NonCritical,
  ): EnvironmentMap<NonCritical, Critical, Config>[keyof NonCritical] {
    return this.environmentMap[variableName];
  }
}

export class EnvironmentVariableUndefinedError extends Error {}
