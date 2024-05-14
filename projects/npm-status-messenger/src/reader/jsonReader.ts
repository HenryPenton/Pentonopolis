import { ISynchronousReader, SyncReader } from "./reader";

export class JSONReader<T> implements ISynchronousReader<T> {
  constructor(private readonly reader: SyncReader) {}

  read = (path: string): T => {
    return JSON.parse(this.reader(path, "utf-8"));
  };
}
