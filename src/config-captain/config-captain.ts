type Environment<NonCritical, Critical, Config> = {
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
  [Property in keyof UserDefinitions]: EnvironmentVariableDefinition;
};

export type ConfigSet<UserDefinitions> = {
  [Property in keyof UserDefinitions]: ConfigVariableDefinition;
};

interface IConfiguration<NonCritical, Critical, Config> {
  getConfigurationVariables: () => Environment<NonCritical, Critical, Config>;
  getConfigurationVariable: (
    variableName: keyof Critical | keyof Config,
  ) => Environment<NonCritical, Critical, Config>[
    | keyof Critical
    | keyof Config];
}

export class Configuration<NonCritical, Critical, Config>
  implements IConfiguration<NonCritical, Critical, Config>
{
  private environment: Environment<NonCritical, Critical, Config> =
    {} as Environment<NonCritical, Critical, Config>;

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
        `The environment variables ${errorString} were undefined`,
      );
    }
  }

  private buildEnvironmentVariableMap(
    variables: VariableSet<Critical | NonCritical>,
  ): void {
    Object.entries(variables).forEach((variable) => {
      const userGivenName = variable[0];
      const entry = variable[1] as EnvironmentVariableDefinition;

      this.environment = {
        ...this.environment,
        [userGivenName]: process.env[entry.name],
      };
    });
  }

  private buildConfigEnvironmentMap(): void {
    Object.entries(this.configVariables).forEach((entry) => {
      const userGivenName = entry[0];
      const configEntry = entry[1] as ConfigVariableDefinition;

      this.environment = {
        ...this.environment,
        [userGivenName]: configEntry.value,
      };
    });
  }

  private buildCriticalEnvironmentMap(): void {
    this.buildEnvironmentVariableMap(this.criticalVariables);
  }

  private buildNonCriticalEnvironmentMap(): void {
    this.buildEnvironmentVariableMap(this.nonCriticalVariables);
  }

  getConfigurationVariables(): Environment<NonCritical, Critical, Config> {
    return this.environment;
  }

  getConfigurationVariable(
    variableName: keyof Critical | keyof Config,
  ): Environment<NonCritical, Critical, Config>[keyof Critical | keyof Config] {
    return this.environment[variableName];
  }

  getConfigurationVariableOrUndefined(
    variableName: keyof NonCritical,
  ): Environment<NonCritical, Critical, Config>[keyof NonCritical] {
    return this.environment[variableName];
  }
}

export class EnvironmentVariableUndefinedError extends Error {}
