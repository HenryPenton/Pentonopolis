import {
  EnvironmentConfiguration,
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
    test("returns an environment variable", () => {
      process.env = { "some-variable": "some-value" };

      const configuration = new EnvironmentConfiguration(
        {
          someVariable: {
            name: "some-variable",
          },
        },
        {},
      );
      const environmentVars = configuration.getEnvironmentVariables();

      const expectedEnvironmentVariables = {
        someVariable: "some-value",
      };

      expect(environmentVars).toEqual(expectedEnvironmentVariables);
    });

    test("returns a list of environment variables", () => {
      process.env = {
        "some-variable": "some-value",
        "some-other-variable": "some-other-value",
      };

      const configuration = new EnvironmentConfiguration(
        {
          someVariable: {
            name: "some-variable",
          },

          someOtherVariable: {
            name: "some-other-variable",
          },
        },
        {},
      );
      const environmentVars = configuration.getEnvironmentVariables();

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
          new EnvironmentConfiguration(
            {},
            {
              someUndefinedVariable: {
                name: "some-undefined-variable",
              },
            },
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
          new EnvironmentConfiguration(
            {},
            {
              someUndefinedVariable: {
                name: "some-undefined-variable",
              },
              someOtherUndefinedVariable: {
                name: "some-other-undefined-variable",
              },
            },
          ),
      ).toThrow(
        new EnvironmentVariableUndefinedError(
          "The environment variables some-undefined-variable and some-other-undefined-variable was undefined",
        ),
      );
    });

    test("three critical environment variables throw if they're not defined", () => {
      expect(
        () =>
          new EnvironmentConfiguration(
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
          ),
      ).toThrow(
        new EnvironmentVariableUndefinedError(
          "The environment variables some-undefined-variable, some-other-undefined-variable and some-final-undefined-variable was undefined",
        ),
      );
    });

    test("gets a critical environment variable", () => {
      process.env = {
        "some-critical-variable": "some-value",
      };
      const config = new EnvironmentConfiguration(
        {},
        { someMustHaveVariable: { name: "some-critical-variable" } },
      );

      const expectedEnvironmentVariables = {
        someMustHaveVariable: "some-value",
      };

      expect(config.getEnvironmentVariables()).toEqual(
        expectedEnvironmentVariables,
      );
    });

    test("gets multiple critical environment variables", () => {
      process.env = {
        "some-must-have-variable": "some-value",
        "some-other-must-have-variable": "some-other-value",
      };
      const config = new EnvironmentConfiguration(
        {},
        {
          someMustHaveVariable: { name: "some-must-have-variable" },
          someOtherMustHaveVariable: { name: "some-other-must-have-variable" },
        },
      );

      const expectedEnvironmentVariables = {
        someMustHaveVariable: "some-value",
        someOtherMustHaveVariable: "some-other-value",
      };

      expect(config.getEnvironmentVariables()).toEqual(
        expectedEnvironmentVariables,
      );
    });
  });
  describe("get single critical environment", () => {
    test("getCriticalEnvironmentVariable", () => {
      process.env = {
        "some-critical-variable": "some-critical-value",
      };
      const config = new EnvironmentConfiguration(
        {},
        { someMustHaveVariable: { name: "some-critical-variable" } },
      );

      const criticalVariable = config.getCriticalEnvironmentVariable(
        "someMustHaveVariable",
      );
      expect(criticalVariable).toBe("some-critical-value");
    });
  });

  describe("get single non-critical environment", () => {
    test("getNonCriticalEnvironmentVariable that exists", () => {
      process.env = {
        "some-non-critical-variable": "some-non-critical-value",
      };
      const config = new EnvironmentConfiguration(
        { someCanHaveVariable: { name: "some-non-critical-variable" } },
        {},
      );

      const nonCriticalVariable = config.getNonCriticalEnvironmentVariable(
        "someCanHaveVariable",
      );
      expect(nonCriticalVariable).toBe("some-non-critical-value");
    });

    test("getNonCriticalEnvironmentVariable that doesn't exist", () => {
      const config = new EnvironmentConfiguration(
        { someCanHaveVariable: { name: "some-non-critical-variable" } },
        {},
      );

      const nonCriticalVariable = config.getNonCriticalEnvironmentVariable(
        "someCanHaveVariable",
      );
      expect(nonCriticalVariable).toBeUndefined();
    });
  });
});
