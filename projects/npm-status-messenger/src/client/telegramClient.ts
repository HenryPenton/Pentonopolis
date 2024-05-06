import { IConfig } from "../startup";
import { IClient } from "./client";

export type IFetch = typeof fetch;

export class TelegramClient implements IClient {
  constructor(
    private fetch: IFetch,
    private config: IConfig
  ) {}

  sendMessage = async (message: string, chatid: string): Promise<void> => {
    const telegramApiUrl =
      this.config.getConfigurationVariable("telegramApiUrl");

    this.fetch(telegramApiUrl, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ chat_id: chatid, text: message })
    });
  };
}
