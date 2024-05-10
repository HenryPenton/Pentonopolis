export type RandomStringGenerator = () => string;
export const generateRandomStrings = (
  numberOfStrings: number,
  randomStringGenerator: RandomStringGenerator
): Set<string> => {
  const randomStrings: Set<string> = new Set();

  for (let count = 0; count < numberOfStrings; count++) {
    const randomValue = randomStringGenerator();
    randomStrings.add(randomValue);
  }

  return randomStrings;
};
