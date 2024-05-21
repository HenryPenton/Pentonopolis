import { program } from "commander";
import { Configuration } from "config-captain";
import { readFileSync } from "fs";
import { NPMAudit, NPMAuditData } from "./services/audit/audit";
import { TelegramClient } from "./client/telegramClient";
import { NPMOutdated, OutdatedData } from "./services/outdated/outdated";
import { JSONReader } from "./reader/jsonReader";
import { NpmAuditValidator } from "./validator/audit/NPMAuditValidator";
import { NpmOutdatedValidator } from "./validator/outdated/NPMOutdatedValidator";

program.option("--audit");
program.option("--outdated");
program.argument("<file>", "file to parse");
program.argument("<packageName>", "name of the package");
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

const auditReader = new JSONReader<NPMAuditData>(
  readFileSync,
  new NpmAuditValidator()
);

const telegramClient = new TelegramClient(fetch, config);

if (audit) {
  try {
    const filepath = program.args[0];
    const packageName = program.args[1];

    const audit = new NPMAudit(telegramClient, auditReader, packageName);

    audit.fire(filepath);
  } catch {
    // eslint-disable-next-line no-console
    console.error("Failed to send audit data");
  }
}

const outdatedReader = new JSONReader<OutdatedData>(
  readFileSync,
  new NpmOutdatedValidator()
);

if (outdated) {
  try {
    const filepath = program.args[0];
    const packageName = program.args[1];

    const outdated = new NPMOutdated(
      telegramClient,
      outdatedReader,
      packageName
    );

    outdated.fire(filepath);
  } catch {
    // eslint-disable-next-line no-console
    console.error("Failed to send outdated package data");
  }
}
