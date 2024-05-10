import { generateRandomStrings } from "../utils/randomStringGenerator/generator";

type ProtectionMap = Map<string, string>;

export class Protection {
  private protectionMap: ProtectionMap;

  constructor(
    protectedWords: string[],
    private randomStringGenerator: () => string
  ) {
    this.protectionMap = this.buildProtectionMap(protectedWords);
  }

  buildProtectionMap = (protectedWords: string[]): ProtectionMap => {
    const protectionMap: ProtectionMap = new Map();
    const randomStrings = generateRandomStrings(
      protectedWords.length,
      this.randomStringGenerator
    ).values();

    protectedWords.forEach((protectedWord) => {
      protectionMap.set(protectedWord, `${randomStrings.next().value}`);
    });

    return protectionMap;
  };

  addWordProtection = (text: string): string => {
    let protectedString = text;
    this.protectionMap.forEach((protectedWordRandomized, originalWord) => {
      const originalWordMatcher = new RegExp(originalWord, "g");
      protectedString = protectedString.replace(
        originalWordMatcher,
        protectedWordRandomized
      );
    });

    return protectedString;
  };

  removeWordProtection = (text: string): string => {
    let unprotectedString = text;
    this.protectionMap.forEach((protectedRandomisedWord, originalWord) => {
      const protectedWordMatcher = new RegExp(protectedRandomisedWord, "g");

      unprotectedString = unprotectedString.replace(
        protectedWordMatcher,
        originalWord
      );
    });
    return unprotectedString;
  };
}
