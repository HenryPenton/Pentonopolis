import { IAuditReader, NPMAudit } from "./audit/audit";
import { Configuration } from "config-captain";

const config = new Configuration({}, { telegramApiUrl: "TELEGRAM_API_URL" }, [
  {}
]);

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
