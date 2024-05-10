export interface IClient {
  sendMessage: (message: string) => Promise<void>;
}
