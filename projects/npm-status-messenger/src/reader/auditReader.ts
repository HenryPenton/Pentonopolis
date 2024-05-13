import { NPMAuditData } from "../audit/audit";
import { IAuditReader, SyncReader } from "./reader";

export class AuditReader implements IAuditReader {
  constructor(private readonly reader: SyncReader) {}

  read = (path: string): NPMAuditData => {
    return JSON.parse(this.reader(path, "utf-8"));
  };
}
