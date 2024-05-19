import { OutdatedData } from "../../../outdated/outdated";
import { mapOutdatedToMessage } from "./outdatedToMessageMapper";
describe("outdatedToMessageMapper", () => {
  test("maps one outdated dependency to a message", () => {
    const data: OutdatedData = {
      abc: {
        latest: "5.6.7",
        current: "4.5.6"
      }
    };
    const message = mapOutdatedToMessage(data);
    expect(message).toEqual("Outdated Packages:\nabc: 4.5.6 -> 5.6.7");
  });

  test("maps multiple outdated dependency to a message", () => {
    const data: OutdatedData = {
      abc: {
        latest: "5.6.7",
        current: "4.5.6"
      },
      def: {
        latest: "2.3.4",
        current: "1.2.3"
      }
    };
    const message = mapOutdatedToMessage(data);
    expect(message).toEqual(
      "Outdated Packages:\nabc: 4.5.6 -> 5.6.7\ndef: 1.2.3 -> 2.3.4"
    );
  });

  test("includes package name in message", () => {
    const data: OutdatedData = {
      abc: {
        latest: "5.6.7",
        current: "4.5.6"
      },
      def: {
        latest: "2.3.4",
        current: "1.2.3"
      }
    };

    const packageName = "some-package";
    const message = mapOutdatedToMessage(data, packageName);

    expect(message).toEqual(
      "Outdated Packages for some-package:\nabc: 4.5.6 -> 5.6.7\ndef: 1.2.3 -> 2.3.4"
    );
  });
});
