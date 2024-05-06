import { Configuration } from "config-captain";
import { IAuditReader, NPMAudit } from "./audit/audit";

const config = new Configuration(
  {},
  { telegramApiUrl: "TELEGRAM_API_URL", telegramChatId: "TELEGRAM_CHAT_ID" },
  [{}]
);

export type IConfig = typeof config;

const dummyReader: IAuditReader = {
  read: async () => ({
    metadata: {
      vulnerabilities: { critical: 1, high: 1, moderate: 1, low: 1, info: 1 }
    }
  })
};

const audit = new NPMAudit(
  config,
  { sendMessage: async (): Promise<void> => {} },
  dummyReader
);

audit.fire();
