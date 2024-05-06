export interface IClient {
  sendMessage: (message: string, chatid: string) => Promise<void>;
}
