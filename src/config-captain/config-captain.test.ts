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
  describe("Environment Map", () => {
    test("returns an environment variable", () => {
      process.env = { "some-variable": "some-value" };
      const variableNames = new Set<string>().add("some-variable");
      const configuration = new EnvironmentConfiguration(
        variableNames,
        new Set(),
      );
      const environmentVars = configuration.getEnvironmentVariables();

      const expectedEnvironmentVariables = new Map<string, string>();
      expectedEnvironmentVariables.set("some-variable", "some-value");

      expect(environmentVars).toEqual(expectedEnvironmentVariables);
    });

    test("returns a list of environment variables", () => {
      process.env = {
        "some-variable": "some-value",
        "some-other-variable": "some-other-value",
      };

      const variableNames = new Set<string>()
        .add("some-variable")
        .add("some-other-variable");
      const configuration = new EnvironmentConfiguration(
        variableNames,
        new Set(),
      );
      const environmentVars = configuration.getEnvironmentVariables();

      const expectedEnvironmentVariables = new Map<string, string>();
      expectedEnvironmentVariables.set("some-variable", "some-value");
      expectedEnvironmentVariables.set(
        "some-other-variable",
        "some-other-value",
      );

      expect(environmentVars).toEqual(expectedEnvironmentVariables);
    });
  });
  describe("setup", () => {
    test("volatile environment variable throws if it's not defined", () => {
      expect(
        () =>
          new EnvironmentConfiguration(
            new Set(),
            new Set<string>().add("some-undefined-variable"),
          ),
      ).toThrow(
        new EnvironmentVariableUndefinedError(
          "The environment variable some-undefined-variable was undefined",
        ),
      );
    });

    test("two volatile environment variables throw if they're not defined", () => {
      expect(
        () =>
          new EnvironmentConfiguration(
            new Set(),
            new Set<string>()
              .add("some-undefined-variable")
              .add("some-other-undefined-variable"),
          ),
      ).toThrow(
        new EnvironmentVariableUndefinedError(
          "The environment variables some-undefined-variable and some-other-undefined-variable was undefined",
        ),
      );
    });

    test("three volatile environment variables throw if they're not defined", () => {
      expect(
        () =>
          new EnvironmentConfiguration(
            new Set(),
            new Set<string>()
              .add("some-undefined-variable")
              .add("some-other-undefined-variable")
              .add("some-final-undefined-variable"),
          ),
      ).toThrow(
        new EnvironmentVariableUndefinedError(
          "The environment variables some-undefined-variable, some-other-undefined-variable and some-final-undefined-variable was undefined",
        ),
      );
    });
  });
});
