import { readFileSync } from "fs";

export type SyncReader = typeof readFileSync;

export interface ISynchronousReader<T> {
  read: (path: string) => T;
}
