import { defaultConfig } from "../../config";
import { punctuationRemover } from "./punctuation";

describe("punctuation", () => {
  test("single question marks removed from the sentence", () => {
    const fullSentence = "Who the who?";
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );
    expect(noPunctuationSentence).toBe("who the who");
  });

  test("multiple question marks removed from the sentence", () => {
    const fullSentence = "Who the who??";
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("single exclamation marks are removed from the sentence", () => {
    const fullSentence = "Who the who!";
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("multiple exclamation marks removed from the sentence", () => {
    const fullSentence = "Who the who!!";
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("single full stop removed from the sentence", () => {
    const fullSentence = "Who the who.";
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("multiple full stops removed from the sentence", () => {
    const fullSentence = "Who the who..";
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("commas are removed from the sentence", () => {
    const fullSentence = "Who, the who";
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("punctuation can come in the middle of the sentence", () => {
    const fullSentence = "Who? the who..";
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("capitals are removed from the sentence", () => {
    const fullSentence = "Who the who";
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("single quotes are removed from the sentence", () => {
    const fullSentence = `'Who the who'`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("double quotes are removed from the sentence", () => {
    const fullSentence = `"Who the who"`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("semi colons are removed from the sentence", () => {
    const fullSentence = `Who the who;`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });
  test("colons are removed from the sentence", () => {
    const fullSentence = `Who the who:`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("left parenthesis are removed from the sentence", () => {
    const fullSentence = `(Who the who`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("right parenthesis are removed from the sentence", () => {
    const fullSentence = `Who the who)`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });
  test("left square brackets are removed from the sentence", () => {
    const fullSentence = `[Who the who`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });
  test("right square brackets are removed from the sentence", () => {
    const fullSentence = `Who the who]`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who the who");
  });

  test("ampersands are removed from the sentence", () => {
    const fullSentence = `Who & who`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("who  who");
  });

  test("slashes are removed from the sentence", () => {
    const fullSentence = `yes/no`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("yes no");
  });

  test("new line is removed from the sentence", () => {
    const fullSentence = `yes \r \n no`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe("yes     no");
  });

  test("multiple new lines are removed from the sentence", () => {
    const fullSentence = `yes \r \n random words in the middle \r \n no`;
    const noPunctuationSentence = punctuationRemover(
      fullSentence,
      defaultConfig
    );

    expect(noPunctuationSentence).toBe(
      "yes     random words in the middle     no"
    );
  });

  describe("word preservation", () => {
    test("a single specified word is protected from the punctuation remover", () => {
      const fullSentence = `I really don't like cheese`;
      const noPunctuationSentence = punctuationRemover(fullSentence, {
        protectionList: ["don't"]
      });

      expect(noPunctuationSentence).toBe("i really don't like cheese");
    });

    test("multiple instances of a specified word are protected from the punctuation remover", () => {
      const fullSentence = `I don't really don't like cheese`;
      const noPunctuationSentence = punctuationRemover(fullSentence, {
        protectionList: ["don't"]
      });

      expect(noPunctuationSentence).toBe("i don't really don't like cheese");
    });

    test("single instances of multiple words are protected from the punctuation remover", () => {
      const fullSentence = `I really can't and don't like cheese`;
      const noPunctuationSentence = punctuationRemover(fullSentence, {
        protectionList: ["don't", "can't"]
      });

      expect(noPunctuationSentence).toBe(
        "i really can't and don't like cheese"
      );
    });
    test("phrase including punctuation is protected from the punctuation remover", () => {
      const fullSentence = `Lock & Co is a hat shop in london`;
      const noPunctuationSentence = punctuationRemover(fullSentence, {
        protectionList: ["Lock & Co"]
      });

      expect(noPunctuationSentence).toBe("Lock & Co is a hat shop in london");
    });
  });

  describe("word preservation with override string generator", () => {
    test("a single specified word is protected from the punctuation remover", () => {
      const override = jest.fn(() => "aaa");
      const fullSentence = `I really don't like cheese`;
      const noPunctuationSentence = punctuationRemover(fullSentence, {
        protectionList: ["don't"],
        overrideUniqueAlphaNumericGenerator: override
      });

      expect(override).toHaveBeenCalled();
      expect(noPunctuationSentence).toBe("i really don't like cheese");
    });
  });
});
