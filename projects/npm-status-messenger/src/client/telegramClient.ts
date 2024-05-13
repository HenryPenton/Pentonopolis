import { IConfig } from "..";
import { IClient } from "./client";

export type IFetch = typeof fetch;

export class TelegramClient implements IClient {
  constructor(
    private fetch: IFetch,
    private config: IConfig
  ) {}

  sendMessage = async (message: string): Promise<void> => {
    const telegramApiUrl =
      this.config.getConfigurationVariable("telegramApiUrl");

    const telegramChatId =
      this.config.getConfigurationVariable("telegramChatId");

    const telegramBotToken =
      this.config.getConfigurationVariable("telegramBotToken");

    const sendMessageUrl = new URL(
      `/bot${telegramBotToken}/sendMessage`,
      `${telegramApiUrl}`
    );

    this.fetch(sendMessageUrl.toString(), {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ chat_id: telegramChatId, text: message })
    });
  };
}
