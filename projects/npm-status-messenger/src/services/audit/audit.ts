import { IClient } from "../../client/client";
import { ISynchronousReader } from "../../reader/reader";
import { mapAuditToMessage } from "../mappers/message/audit/auditToMessageMapper";
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

  private isAuditMessageRequired = (data: NPMAuditData): boolean => {
    const { low, moderate, info, critical, high } =
      data.metadata.vulnerabilities;

    return !(
      info === 0 &&
      low === 0 &&
      moderate === 0 &&
      high === 0 &&
      critical === 0
    );
  };

  fire = (pathToFile: string): void => {
    try {
      const auditData = this.reader.read(pathToFile);
      const isAuditMessageRequired = this.isAuditMessageRequired(auditData);
      if (isAuditMessageRequired) {
        const message = mapAuditToMessage(auditData);
        this.client.sendMessage(message);
      }
    } catch {
      this.client.sendMessage("No parseable vulnerability data could be found");
    }
  };
}
