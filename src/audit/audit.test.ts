import { Audit, IClient, mapAuditToMessage } from "./audit";

describe("Audit", () => {
  test("fire sends data to the client", async () => {
    const stubClient: IClient = { sendMessage: jest.fn() };
    const audit = new Audit(stubClient);
    await audit.fire();

    expect(stubClient.sendMessage).toHaveBeenCalledWith("message", "chatid");
  });
//   test("gets audit data from a file", async () => {
//     const stubClient: IClient = { sendMessage: jest.fn() };
//     const stubReader: IReader = { read: jest.fn() };
//     const audit = new Audit(stubClient, stubReader);
//     await audit.fire();

//     expect(stubClient.sendMessage).toHaveBeenCalledWith(
//       "Vulnerabilities: info: 1, low: 2, moderate: 3, high: 4, critical: 5",
//       "chatid",
//     );
//   });

  describe("formatData", () => {
    test("data formatted correctly", async () => {
      const message = mapAuditToMessage({
        metadata: {
          vulnerabilities: {
            info: 1,
            low: 2,
            moderate: 3,
            high: 4,
            critical: 5,
          },
        },
      });

      expect(message).toEqual(
        "Vulnerabilities: info: 1, low: 2, moderate: 3, high: 4, critical: 5",
      );
    });
  });
});
