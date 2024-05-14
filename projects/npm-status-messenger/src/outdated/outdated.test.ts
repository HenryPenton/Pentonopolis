import { IClient } from "../client/client";
import { ISynchronousReader } from "../reader/reader";
import { NPMOutdated, OutdatedData } from "./outdated";

describe("outdated", () => {
  test("fire sends message built from reader data using the client", () => {
    const dummyClient: IClient = {
      sendMessage: jest.fn()
    };

    const dummyReader: ISynchronousReader<OutdatedData> = {
      read: jest
        .fn()
        .mockReturnValue({ def: { latest: "1.2.4", current: "1.2.3" } })
    };

    const outdated = new NPMOutdated(dummyClient, dummyReader);
    outdated.fire("");

    expect(dummyClient.sendMessage).toHaveBeenCalledWith(
      "Outdated Packages:\ndef: 1.2.3 -> 1.2.4"
    );
  });
});
