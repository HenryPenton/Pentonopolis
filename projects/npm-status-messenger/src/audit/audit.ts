import { IClient } from "../client/client";
import { mapAuditToMessage } from "../mappers/auditToMessageMapper";
import { ISynchronousReader } from "../reader/reader";
import { IRunner } from "../runner/runner";

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

export class NPMAudit implements IRunner {
  constructor(
    private client: IClient,
    private reader: ISynchronousReader<NPMAuditData>
  ) {}

  fire = (pathToFile: string): void => {
    try {
      const auditData = this.reader.read(pathToFile);
      const message = mapAuditToMessage(auditData);
      this.client.sendMessage(message);
    } catch {
      this.client.sendMessage("No parseable vulnerability data could be found");
    }
  };
}
