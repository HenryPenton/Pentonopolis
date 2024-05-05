import { defaultConfig } from "../../config";
import {
  getSentenceComponents,
  getUniqueSentenceComponents
} from "./sentenceComponents";

describe("sentence components", () => {
  test("splits sentence of one word", () => {
    const sentenceComponents = getSentenceComponents("xyz", defaultConfig);
    expect(sentenceComponents).toEqual(["xyz"]);
  });

  test("splits sentence of two words", () => {
    const sentenceComponents = getSentenceComponents("xyz abc", defaultConfig);
    expect(sentenceComponents).toEqual(["xyz", "abc"]);
  });

  test("splits sentence of five words", () => {
    const sentenceComponents = getSentenceComponents(
      "the big brown fat cat",
      defaultConfig
    );
    expect(sentenceComponents).toEqual(["the", "big", "brown", "fat", "cat"]);
  });

  test("spaces are not returned in the components", () => {
    const sentenceComponents = getSentenceComponents(
      "the     big    brown     fat     cat",
      defaultConfig
    );
    expect(sentenceComponents).toEqual(["the", "big", "brown", "fat", "cat"]);
  });

  describe("word preservation", () => {
    test("a phrase can be protected from the sentence splitter", () => {
      const fullSentence = `Lock & Co`;
      const components = getSentenceComponents(fullSentence, {
        protectionList: ["Lock & Co"]
      });

      expect(components).toEqual(["Lock & Co"]);
    });
    test("Multiple phrases can be protected from the sentence splitter", () => {
      const fullSentence = `Lock & Co, abc:xyz`;
      const components = getSentenceComponents(fullSentence, {
        protectionList: ["Lock & Co", "abc:xyz"]
      });

      expect(components).toEqual(["Lock & Co", "abc:xyz"]);
    });
  });

  describe("word preservation with override string generator", () => {
    test("a single specified word is protected from the punctuation remover", () => {
      const override = jest
        .fn()
        .mockImplementationOnce(() => "aaa")
        .mockImplementationOnce(() => "bbb");
      const fullSentence = `Lock & Co`;
      const components = getSentenceComponents(fullSentence, {
        protectionList: ["Lock & Co"],
        overrideUniqueAlphaNumericGenerator: override
      });

      expect(override).toHaveBeenCalledTimes(2);
      expect(components).toEqual(["Lock & Co"]);
    });
  });
});

describe("unique sentence components", () => {
  test("gets the unique components of the sentence", () => {
    const sentenceComponents = getUniqueSentenceComponents(
      "cat cat cat cat",
      defaultConfig
    );
    expect(sentenceComponents).toEqual(new Set(["cat"]));
  });
});
