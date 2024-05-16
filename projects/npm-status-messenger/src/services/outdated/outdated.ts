import { IClient } from "../../client/client";
import { ISynchronousReader } from "../../reader/reader";
import { mapOutdatedToMessage } from "../mappers/message/outdated/outdatedToMessageMapper";
import { IRunner } from "../runner/runner";

export type OutdatedData = {
  [key: string]: { current: string; latest: string };
};

export class NPMOutdated implements IRunner {
  constructor(
    private client: IClient,
    private reader: ISynchronousReader<OutdatedData>
  ) {}

  isOutdatedMessageRequired = (data: OutdatedData): boolean => {
    const outdatedEntriesMap = new Map(Object.entries(data));
    return outdatedEntriesMap.size !== 0;
  };

  fire = (path: string): void => {
    try {
      const outdatedData = this.reader.read(path);
      const isOutdatedMessageRequired =
        this.isOutdatedMessageRequired(outdatedData);
      if (isOutdatedMessageRequired) {
        const message = mapOutdatedToMessage(outdatedData);

        this.client.sendMessage(message);
      }
    } catch {
      this.client.sendMessage("No parseable version data could be found");
    }
  };
}
