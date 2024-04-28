import { IAuditReader, NPMAudit } from "./audit/audit";

const dummyReader: IAuditReader = {
  read: async () => ({
    metadata: {
      vulnerabilities: { critical: 1, high: 1, moderate: 1, low: 1, info: 1 },
    },
  }),
};

const audit = new NPMAudit(
  { sendMessage: async (): Promise<void> => {} },
  dummyReader,
);

audit.fire();
