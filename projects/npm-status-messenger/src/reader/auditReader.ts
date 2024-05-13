import { NPMAuditData } from "../audit/audit";
import { IAuditReader, SyncReader } from "./reader";

export class AuditReader implements IAuditReader {
  constructor(private reader: SyncReader) {}
  read = (): NPMAuditData => {
    return {
      metadata: {
        vulnerabilities: { info: 1, high: 1, low: 1, moderate: 1, critical: 1 }
      }
    };
  };
}
