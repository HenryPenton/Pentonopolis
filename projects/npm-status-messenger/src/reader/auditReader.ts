import { NPMAuditData } from "../audit/audit";
import { IAuditReader } from "./reader";

export class AuditReader implements IAuditReader {
  read = (): NPMAuditData => {
    return {
      metadata: {
        vulnerabilities: { info: 1, high: 1, low: 1, moderate: 1, critical: 1 }
      }
    };
  };
}
