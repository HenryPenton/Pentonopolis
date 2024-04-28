import { Audit, IClient } from "./audit";

describe("Audit", () => {
  test("fire sends data to the client", async () => {
    const stubClient: IClient = { sendMessage: jest.fn() };
    const audit = new Audit(stubClient);
    await audit.fire();

    expect(stubClient.sendMessage).toHaveBeenCalledWith("message", "chatid");
  });
});
