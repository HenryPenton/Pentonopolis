import {
  Configuration,
  EnvironmentVariableUndefinedError,
} from "./config-captain";

let originalEnv;

describe("config captain", () => {
  beforeAll(() => {
    originalEnv = process.env;
  });

  afterEach(() => {
    process.env = originalEnv;
  });
  describe("non critical environment variables", () => {
    test("returns an environment map of one variable", () => {
      process.env = { "some-variable": "some-value" };

      const configuration = new Configuration(
        {
          someVariable: {
            name: "some-variable",
          },
        },
        {},
        {},
      );
      const environmentVars = configuration.getConfigurationVariables();

      const expectedEnvironmentVariables = {
        someVariable: "some-value",
      };

      expect(environmentVars).toEqual(expectedEnvironmentVariables);
    });

    test("returns an environment map of multiple environment variables", () => {
      process.env = {
        "some-variable": "some-value",
        "some-other-variable": "some-other-value",
      };

      const configuration = new Configuration(
        {
          someVariable: {
            name: "some-variable",
          },

          someOtherVariable: {
            name: "some-other-variable",
          },
        },
        {},
        {},
      );
      const environmentVars = configuration.getConfigurationVariables();

      const expectedEnvironmentVariables = {
        someVariable: "some-value",
        someOtherVariable: "some-other-value",
      };

      expect(environmentVars).toEqual(expectedEnvironmentVariables);
    });
  });

  describe("critical environment variables", () => {
    test("critical environment variable throws if it's not defined", () => {
      expect(
        () =>
          new Configuration(
            {},
            {
              someUndefinedVariable: {
                name: "some-undefined-variable",
              },
            },
            {},
          ),
      ).toThrow(
        new EnvironmentVariableUndefinedError(
          "The environment variable some-undefined-variable was undefined",
        ),
      );
    });

    test("two critical environment variables throw if they're not defined", () => {
      expect(
        () =>
          new Configuration(
            {},
            {
              someUndefinedVariable: {
                name: "some-undefined-variable",
              },
              someOtherUndefinedVariable: {
                name: "some-other-undefined-variable",
              },
            },
            {},
          ),
      ).toThrow(
        new EnvironmentVariableUndefinedError(
          "The environment variables some-undefined-variable and some-other-undefined-variable were undefined",
        ),
      );
    });

    test("three critical environment variables throw if they're not defined", () => {
      expect(
        () =>
          new Configuration(
            {},
            {
              someUndefinedVariable: {
                name: "some-undefined-variable",
              },
              someOtherUndefinedVariable: {
                name: "some-other-undefined-variable",
              },
              someFinalUndefinedVariable: {
                name: "some-final-undefined-variable",
              },
            },
            {},
          ),
      ).toThrow(
        new EnvironmentVariableUndefinedError(
          "The environment variables some-undefined-variable, some-other-undefined-variable and some-final-undefined-variable were undefined",
        ),
      );
    });

    test("gets a critical environment variable", () => {
      process.env = {
        "some-critical-variable": "some-value",
      };
      const config = new Configuration(
        {},
        { someMustHaveVariable: { name: "some-critical-variable" } },
        {},
      );

      const expectedEnvironmentVariables = {
        someMustHaveVariable: "some-value",
      };

      expect(config.getConfigurationVariables()).toEqual(
        expectedEnvironmentVariables,
      );
    });

    test("gets multiple critical environment variables", () => {
      process.env = {
        "some-must-have-variable": "some-value",
        "some-other-must-have-variable": "some-other-value",
      };
      const config = new Configuration(
        {},
        {
          someMustHaveVariable: { name: "some-must-have-variable" },
          someOtherMustHaveVariable: { name: "some-other-must-have-variable" },
        },
        {},
      );

      const expectedEnvironmentVariables = {
        someMustHaveVariable: "some-value",
        someOtherMustHaveVariable: "some-other-value",
      };

      expect(config.getConfigurationVariables()).toEqual(
        expectedEnvironmentVariables,
      );
    });
  });

  describe("other configuration variables", () => {
    test("returns an environment map of one variable", () => {
      const configuration = new Configuration(
        {},
        {},
        { someVariable: { value: "some-value" } },
      );
      const environmentVars = configuration.getConfigurationVariables();

      const expectedEnvironmentVariables = {
        someVariable: "some-value",
      };

      expect(environmentVars).toEqual(expectedEnvironmentVariables);
    });

    test("returns an environment map of multiple variables", () => {
      const configuration = new Configuration(
        {},
        {},
        {
          someVariable: { value: "some-value" },
          someOtherVariable: { value: "some-other-value" },
        },
      );
      const environmentVars = configuration.getConfigurationVariables();

      const expectedEnvironmentVariables = {
        someVariable: "some-value",
        someOtherVariable: "some-other-value",
      };

      expect(environmentVars).toEqual(expectedEnvironmentVariables);
    });
  });

  describe("getConfigurationVariable", () => {
    test("get single environment variable", () => {
      process.env = {
        "some-critical-variable": "some-critical-value",
      };
      const config = new Configuration(
        {},
        { someMustHaveVariable: { name: "some-critical-variable" } },
        {},
      );

      const criticalVariable = config.getConfigurationVariable(
        "someMustHaveVariable",
      );
      expect(criticalVariable).toBe("some-critical-value");
    });

    test("get single config variable", () => {
      const config = new Configuration(
        {},
        {},
        { someMustHaveVariable: { value: "some-config-value" } },
      );

      const configVariable = config.getConfigurationVariable(
        "someMustHaveVariable",
      );
      expect(configVariable).toBe("some-config-value");
    });
  });

  describe("getConfigurationVariableOrUndefined", () => {
    test("getConfigurationVariableOrUndefined that exists", () => {
      process.env = {
        "some-non-critical-variable": "some-non-critical-value",
      };
      const config = new Configuration(
        { someCanHaveVariable: { name: "some-non-critical-variable" } },
        {},
        {},
      );

      const nonCriticalVariable = config.getConfigurationVariableOrUndefined(
        "someCanHaveVariable",
      );
      expect(nonCriticalVariable).toBe("some-non-critical-value");
    });

    test("getConfigurationVariableOrUndefined that doesn't exist", () => {
      const config = new Configuration(
        { someCanHaveVariable: { name: "some-non-critical-variable" } },
        {},
        {},
      );

      const nonCriticalVariable = config.getConfigurationVariableOrUndefined(
        "someCanHaveVariable",
      );
      expect(nonCriticalVariable).toBeUndefined();
    });
  });
});
