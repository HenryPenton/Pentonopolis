import { Configuration } from "config-captain";
import { IAuditReader, NPMAudit } from "./audit/audit";
import { TelegramClient } from "./client/telegramClient";

const config = new Configuration(
  {},
  {
    telegramApiUrl: "TELEGRAM_API_URL",
    telegramChatId: "TELEGRAM_CHAT_ID",
    telegramBotToken: "TELEGRAM_BOT_TOKEN"
  },
  [process.env]
);

export type IConfig = typeof config;

export const run = (): void => {
  const telegramClient = new TelegramClient(fetch, config);

  const dummyReader: IAuditReader = {
    read: async () => ({
      metadata: {
        vulnerabilities: { critical: 1, high: 1, moderate: 1, low: 1, info: 1 }
      }
    })
  };

  const audit = new NPMAudit(telegramClient, dummyReader);

  audit.fire();
};
