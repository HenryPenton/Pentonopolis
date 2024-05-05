export interface IClient {
  sendMessage: (message: string, chatid: string) => Promise<void>;
}

export type IFetch = typeof fetch;

export class TelegramClient implements IClient {
  constructor(private fetch: IFetch) {}

  sendMessage = async (message: string, chatid: string): Promise<void> => {
    this.fetch("telegram-api-url", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ chat_id: chatid, text: message })
    });
  };
}
