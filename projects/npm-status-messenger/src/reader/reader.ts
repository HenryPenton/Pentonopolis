import { NPMAuditData } from "../audit/audit";

export interface ISynchronousReader<T> {
  read: () => T;
}
export interface IAuditReader extends ISynchronousReader<NPMAuditData> {}
