import { program } from "commander";
import { Configuration } from "config-captain";
import { readFileSync } from "fs";
import { NPMAudit, NPMAuditData } from "./audit/audit";
import { TelegramClient } from "./client/telegramClient";
import { JSONReader } from "./reader/jsonReader";
import { NpmAuditValidator } from "./validator/NPMAuditValidator";

program.option("--audit");
program.option("--outdated");
program.argument("<file>", "file to parse");
program.parse();

const { audit, outdated } = program.opts();

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

const reader = new JSONReader<NPMAuditData>(
  readFileSync,
  new NpmAuditValidator()
);

const telegramClient = new TelegramClient(fetch, config);

if (audit) {
  try {
    const audit = new NPMAudit(telegramClient, reader);

    audit.fire(program.args[0]);
  } catch {
    // eslint-disable-next-line no-console
    console.error("Failed to get audit data");
  }
}
if (outdated) {
  // eslint-disable-next-line no-console
  console.log(program.args[0]);
  // eslint-disable-next-line no-console
  console.log("outdated placeholder");
}
