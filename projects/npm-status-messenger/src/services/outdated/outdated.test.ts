import { IClient } from "../../client/client";
import { NoDataAvailableError } from "../../errors/dataErrors";
import { ISynchronousReader } from "../../reader/reader";
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

    const outdated = new NPMOutdated(
      dummyClient,
      dummyReader,
      "some-package-name"
    );
    outdated.fire("");

    expect(dummyClient.sendMessage).toHaveBeenCalledWith(
      "Outdated Packages for some-package-name:\ndef: 1.2.3 -> 1.2.4"
    );
  });

  test("sends a warning if outdated data not found", () => {
    const stubClient: IClient = { sendMessage: jest.fn() };

    const stubReader: ISynchronousReader<OutdatedData> = {
      read: () => {
        throw new NoDataAvailableError();
      }
    };

    const outdated = new NPMOutdated(
      stubClient,
      stubReader,
      "some-other-package-name"
    );
    outdated.fire("path/to/outdated/file");

    expect(stubClient.sendMessage).toHaveBeenCalledWith(
      "No parseable version data could be found"
    );
  });
  test("doesn't send a message if there are no outdated packages", () => {
    const stubClient: IClient = { sendMessage: jest.fn() };

    const stubReader: ISynchronousReader<OutdatedData> = {
      read: () => {
        return {};
      }
    };

    const audit = new NPMOutdated(
      stubClient,
      stubReader,
      "name-of-up-to-date-package"
    );
    audit.fire("path/to/outdated/file");

    expect(stubClient.sendMessage).not.toHaveBeenCalled();
  });
});
