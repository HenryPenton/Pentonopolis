import { getDummyConfig } from "../dummy_config/dummyConfig";
import { IFetch, TelegramClient } from "./telegramClient";
describe("Telegram Client", () => {
  test("sends message to telegram", () => {
    const stubFetch: IFetch = jest.fn();
    const dummyConfig = getDummyConfig({
      TELEGRAM_API_URL: "telegram-endpoint"
    });

    const telegramClient = new TelegramClient(stubFetch, dummyConfig);
    telegramClient.sendMessage("some message", "some-chat-id");

    expect(stubFetch).toHaveBeenCalledWith("telegram-endpoint", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: '{"chat_id":"some-chat-id","text":"some message"}'
    });
  });
});
