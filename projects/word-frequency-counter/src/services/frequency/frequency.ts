import { Config, defaultConfig } from "../../config";
import { getUniqueSentenceComponents } from "../../utils/sentenceComponents/sentenceComponents";
import { allWordCount } from "../wordCount/wordCount";

type FrequencyMap = Map<string, number>;

/**
 * Find frequency of a given word in a block of text.
 *
 * @param {string} text - The text to parse.
 * @param {string} word - The word to check the frequency of.
 * @param {Config} config - Configuration for the word counter
 */
export const singleFrequencyCount = (
  text: string,
  word: string,
  config: Config = defaultConfig
): number => {
  const wordMap = allWordCount(text, config);
  let total = 0;
  wordMap.forEach((wordCount) => (total += wordCount));

  const wordCount = wordMap.get(word);

  if (wordCount) {
    const frequency = wordCount / total;
    return Number(frequency.toFixed(4));
  }

  return 0;
};

/**
 * Count frequency of all words in a block of text.
 *
 * @param {string} text - The text to parse.
 * @param {Config} config - Configuration for the word counter
 */
export const allFrequencyCount = (
  text: string,
  config: Config = defaultConfig
): FrequencyMap => {
  const uniqueSentenceComponents = getUniqueSentenceComponents(text, config);

  const frequencyMap: FrequencyMap = new Map();

  uniqueSentenceComponents.forEach((uniqueSentenceComponent) => {
    const single = singleFrequencyCount(text, uniqueSentenceComponent, config);

    frequencyMap.set(uniqueSentenceComponent, single);
  });

  return frequencyMap;
};
