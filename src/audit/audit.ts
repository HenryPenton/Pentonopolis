export interface IAudit {
  fire: () => Promise<void>;
}

export interface IClient {
  sendMessage: (message: string, chatid: string) => Promise<void>;
}

export class Audit implements IAudit {
  constructor(private client: IClient) {}

  fire = async (): Promise<void> => {
    this.client.sendMessage("message", "chatid");
  };
}
