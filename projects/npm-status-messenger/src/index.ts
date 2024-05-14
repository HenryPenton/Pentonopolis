import { program } from "commander";
import { Configuration } from "config-captain";
import { readFileSync } from "fs";
import { NPMAudit, NPMAuditData } from "./audit/audit";
import { TelegramClient } from "./client/telegramClient";
import { JSONReader } from "./reader/jsonReader";

program.option("--audit");
program.argument("<file>", "file to parse");
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

const reader = new JSONReader<NPMAuditData>(readFileSync);

if (audit) {
  const telegramClient = new TelegramClient(fetch, config);
  const audit = new NPMAudit(telegramClient, reader);

  audit.fire("./audit.json");
}
