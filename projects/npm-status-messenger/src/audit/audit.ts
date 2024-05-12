import { IClient } from "../client/client";
import { mapAuditToMessage } from "../mappers/auditToMessageMapper";
import { IAuditReader } from "../reader/reader";

export type NPMAuditData = {
  metadata: {
    vulnerabilities: {
      info: number;
      low: number;
      moderate: number;
      high: number;
      critical: number;
    };
  };
};

export interface IAudit {
  fire: () => Promise<void>;
}

export class NPMAudit implements IAudit {
  constructor(
    private client: IClient,
    private reader: IAuditReader
  ) {}

  fire = async (): Promise<void> => {
    const auditData = await this.reader.read();
    const message = mapAuditToMessage(auditData);

    this.client.sendMessage(message);
  };
}
