import { Configuration } from "config-captain";
import { NPMAudit } from "./audit/audit";
import { TelegramClient } from "./client/telegramClient";
import { AuditReader } from "./reader/auditReader";

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

const reader = new AuditReader();

export const run = (): void => {
  const telegramClient = new TelegramClient(fetch, config);

  const audit = new NPMAudit(telegramClient, reader);

  audit.fire();
};
