interface IEnvironmentConfiguration<CanHave, MustHave> {
  getEnvironmentVariables: () => EnvironmentMap<CanHave, MustHave>;
}

type EnvironmentMap<CanHave, MustHave> = {
  [Property in keyof CanHave]?: string;
} & {
  [Property in keyof MustHave]: string;
};

export type EnvironmentVariableDefinition = {
  name: string;
};

export type VariableSet<UserDefinitions> = {
  [Property in keyof UserDefinitions]: EnvironmentVariableDefinition;
};

export class EnvironmentConfiguration<CanHave, MustHave>
  implements IEnvironmentConfiguration<CanHave, MustHave>
{
  private environmentMap: EnvironmentMap<CanHave, MustHave> =
    {} as EnvironmentMap<CanHave, MustHave>;
  private canHaveVariables: VariableSet<CanHave>;
  private mustHaveVariables: VariableSet<MustHave>;

  constructor(
    canHaveVariables: VariableSet<CanHave>,
    mustHaveVariables: VariableSet<MustHave>,
  ) {
    this.canHaveVariables = canHaveVariables;
    this.mustHaveVariables = mustHaveVariables;

    this.checkMustHaveEnvironmentVariables();
    this.buildCanHaveEnvironmentMap();
    this.buildMustHaveEnvironmentMap();
  }

  private checkMustHaveEnvironmentVariables(): void {
    const erroredVariables: string[] = [];

    Object.values(this.mustHaveVariables).forEach((objectValue) => {
      const mustHaveEntry = objectValue as EnvironmentVariableDefinition;
      const variableFromEnv = process.env[mustHaveEntry.name];

      if (!variableFromEnv) erroredVariables.push(mustHaveEntry.name);
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

  private buildMustHaveEnvironmentMap(): void {
    Object.entries(this.mustHaveVariables).forEach((entry) => {
      const userGivenName = entry[0];
      const mustHaveEntry = entry[1] as EnvironmentVariableDefinition;

      this.environmentMap = {
        ...this.environmentMap,
        [userGivenName]: process.env[mustHaveEntry.name],
      };
    });
  }

  private buildCanHaveEnvironmentMap(): void {
    Object.entries(this.canHaveVariables).forEach((entry) => {
      const userGivenName = entry[0];
      const canHaveEntry = entry[1] as EnvironmentVariableDefinition;

      this.environmentMap = {
        ...this.environmentMap,
        [userGivenName]: process.env[canHaveEntry.name],
      };
    });
  }

  getEnvironmentVariables(): EnvironmentMap<CanHave, MustHave> {
    return this.environmentMap;
  }
}
export class EnvironmentVariableUndefinedError extends Error {}
