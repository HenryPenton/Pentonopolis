import { program } from "commander";
import { Configuration } from "config-captain";
import { readFileSync } from "fs";
import { NPMAudit } from "./audit/audit";
import { TelegramClient } from "./client/telegramClient";
import { AuditReader } from "./reader/auditReader";

program.option("--audit");
program.parse();
const { audit } = program.opts();

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

const reader = new AuditReader(readFileSync);

if (audit) {
  const telegramClient = new TelegramClient(fetch, config);
  const audit = new NPMAudit(telegramClient, reader);

  audit.fire("./audit.json");
}
