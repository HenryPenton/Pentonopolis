import { IClient } from "../client/client";
import { ISynchronousReader } from "../reader/reader";
import { IRunner } from "../runner/runner";

export type OutdatedData = {
  [key: string]: { current: string; latest: string };
};

export class NPMOutdated implements IRunner {
  constructor(
    private client: IClient,
    private reader: ISynchronousReader<OutdatedData>
  ) {}
  fire = (): void => {};
}
