export type NPMAudit = {
  metadata: {
    vulnerabilities: {
      info: number;
      low: number;
      moderate: number;
      high: number;
      critical: number;
    };
  };
};

export interface IAudit {
  fire: () => Promise<void>;
}

export interface IClient {
  sendMessage: (message: string, chatid: string) => Promise<void>;
}

export interface IReader {
  sendMessage: (message: string, chatid: string) => Promise<void>;
}

export class Audit implements IAudit {
  constructor(private client: IClient) {}

  fire = async (): Promise<void> => {
    this.client.sendMessage("message", "chatid");
  };
}

export const mapAuditToMessage = (audit: NPMAudit): string => {
  const vulnerabilityMap = new Map(
    Object.entries(audit.metadata.vulnerabilities),
  );

  let message = `Vulnerabilities: `;
  vulnerabilityMap.forEach((vulnerabilityCount, vulnerabilityName) => {
    message += `${vulnerabilityName}: ${vulnerabilityCount}, `;
  });

  return message.slice(0, message.length - 2);
};
