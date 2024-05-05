import { defaultConfig } from "./config";
describe("default config", () => {
  test("default config is empty", () => {
    expect(defaultConfig).toStrictEqual({ protectionList: [] });
  });
});
