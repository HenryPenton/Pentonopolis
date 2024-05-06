import { IFetch, TelegramClient } from "./telegramClient";
describe("Telegram Client", () => {
  test("sends message to telegram", () => {
    const stubFetch: IFetch = jest.fn();
    const telegramClient = new TelegramClient(stubFetch);
    telegramClient.sendMessage("some message", "some-chat-id");

    expect(stubFetch).toHaveBeenCalledWith("telegram-api-url", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: '{"chat_id":"some-chat-id","text":"some message"}'
    });
  });
});
