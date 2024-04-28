import { Audit } from "./audit/audit";

const audit = new Audit({ sendMessage: async (): Promise<void> => {} });

audit.fire();
