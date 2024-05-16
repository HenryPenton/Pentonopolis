import { IClient } from "../client/client";
import { mapOutdatedToMessage } from "../mappers/message/outdated/outdatedToMessageMapper";
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

  fire = (path: string): void => {
    try {
      const outdatedData = this.reader.read(path);
      const message = mapOutdatedToMessage(outdatedData);

      this.client.sendMessage(message);
    } catch {
      this.client.sendMessage("No parseable version data could be found");
    }
  };
}
