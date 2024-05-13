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
  fire: (pathToFile: string) => void;
}

export class NPMAudit implements IAudit {
  constructor(
    private client: IClient,
    private reader: IAuditReader
  ) {}

  fire = (pathToFile: string): void => {
    const auditData = this.reader.read(pathToFile);
    const message = mapAuditToMessage(auditData);

    this.client.sendMessage(message);
  };
}
