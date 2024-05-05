import {
  MathRandomGeneratorDuplicateError,
  OverrideGeneratorAlphanumericError,
  OverrideGeneratorCapitalError,
  OverrideGeneratorDuplicateError
} from "../../errors/generatorErrors/generatorErrors";

const generateRandomString = (): string => {
  const alphanumeric = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * alphanumeric.length);
    result += alphanumeric.charAt(randomIndex);
  }

  return result;
};

export const generateRandomStrings = (
  numberOfStrings: number,
  override?: () => string
): Set<string> => {
  const randomStrings: Set<string> = new Set();
  const hasOverride = !!override;

  for (let count = 0; count < numberOfStrings; count++) {
    const randomValue = hasOverride ? override() : generateRandomString();
    checkStringTypeErrors(randomValue);

    randomStrings.add(randomValue);
  }
  checkStringDuplicateErrors(hasOverride, randomStrings, numberOfStrings);
  return randomStrings;
};

const checkStringTypeErrors = (randomValue: string): void => {
  if (!isAlphaNumeric(randomValue)) {
    throw new OverrideGeneratorAlphanumericError(
      "The override generator provided generated a non alphanumeric string"
    );
  }
  if (containsCaps(randomValue)) {
    throw new OverrideGeneratorCapitalError(
      "The override generator provided generated a string containing capital letters"
    );
  }
};

const checkStringDuplicateErrors = (
  hasOverride: boolean,
  randomStrings: Set<string>,
  numberOfStrings: number
): void => {
  const hasStringDuplicate = randomStrings.size < numberOfStrings;
  if (hasStringDuplicate && hasOverride) {
    throw new OverrideGeneratorDuplicateError(
      "It looks like the override generator you provided generated the same 'random' string twice!"
    );
  }
  if (hasStringDuplicate && !hasOverride) {
    throw new MathRandomGeneratorDuplicateError(
      "It looks like Math.random generated the same 'random' string twice! Sorry about that, you may wish to provide an override generator."
    );
  }
};

const isAlphaNumeric = (string: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(string);
};

const containsCaps = (string: string): boolean => {
  return /[A-Z]/.test(string);
};
