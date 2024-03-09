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
  });
});
