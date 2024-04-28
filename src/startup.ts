import { NPMAudit } from "./audit/audit";

const audit = new NPMAudit({ sendMessage: async (): Promise<void> => {} });

audit.fire();
