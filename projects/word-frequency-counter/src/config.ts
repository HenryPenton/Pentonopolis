export type Config = {
  protectionList: string[];
  overrideUniqueAlphaNumericGenerator?: () => string;
};

export const defaultConfig: Config = { protectionList: [] };
