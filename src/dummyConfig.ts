import { Configuration } from "./config/config-captain";
import { IConfig } from "./startup";

type Overrides = { [key: string]: string };
export const getDummyConfig = (overrides: Overrides = {}): IConfig => {
  const dummyConfig: IConfig = new Configuration(
    {},
    { telegramApiUrl: "TELEGRAM_API_URL" },
    [{ TELEGRAM_API_URL: "dummy-url", ...overrides }],
  );

  return dummyConfig;
};
