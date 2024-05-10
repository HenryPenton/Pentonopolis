import { Config, defaultConfig } from "../../config";
import { punctuationRemover } from "../../utils/punctuation/punctuation";
import {
  getSentenceComponents,
  getUniqueSentenceComponents
} from "../../sentenceComponents/sentenceComponents";

type WordMap = Map<string, number>;
/**
 * Count instances of a given word in a block of text.
 *
 * @param {string} text - The text to parse.
 * @param {string} word - The word to count.
 * @param {Config} config - Configuration for the word counter
 */
export const singleWordCount = (
  text: string,
  word: string,
  config: Config = defaultConfig
): number => {
  const punctuationRemovedSearch = punctuationRemover(word, config);
  const sentenceComponents = getSentenceComponents(text, config);

  const totalOccurrences = sentenceComponents.filter(
    (word) => word === punctuationRemovedSearch
  );

  return totalOccurrences.length;
};

/**
 * Count instances of all words in a block of text.
 *
 * @param {string} text - The text to parse.
 * @param {Config} config - Configuration for the word counter
 */
export const allWordCount = (
  text: string,
  config: Config = defaultConfig
): WordMap => {
  const uniqueSentenceComponents = getUniqueSentenceComponents(text, config);

  const wordMap: WordMap = new Map();

  uniqueSentenceComponents.forEach((word) => {
    const wordCount = singleWordCount(text, word, config);
    wordMap.set(word, wordCount);
  });

  return wordMap;
};
