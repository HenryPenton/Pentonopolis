import { readFileSync } from "fs";
import { NPMAuditData } from "../audit/audit";

export type SyncReader = typeof readFileSync;

export interface ISynchronousReader<T> {
  read: (path: string) => T;
}

export interface IAuditReader extends ISynchronousReader<NPMAuditData> {}
