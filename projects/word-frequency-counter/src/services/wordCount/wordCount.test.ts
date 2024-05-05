import * as WordCount from "./wordCount";

describe("word count", () => {
  describe("single word count", () => {
    test("counts the occurrences of a word in a string where there's one of the word", () => {
      const wordToCount = "how";
      const fullSentence = "how are you";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(1);
    });

    test("counts the occurrences of a word in a string where there's multiple of the word", () => {
      const wordToCount = "what";
      const fullSentence = "what the what";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("counts the word regardless of its case", () => {
      const wordToCount = "Who";
      const fullSentence = "who the who";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("counts the occurrences regardless of sentence case", () => {
      const wordToCount = "who";
      const fullSentence = "Who the who";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });
  });

  describe("all word count", () => {
    test("counts the number of every word in a string for a one word string", () => {
      const fullSentence = "how";
      const countMap = WordCount.allWordCount(fullSentence);

      const expectedCountMap = new Map<string, number>();
      expectedCountMap.set("how", 1);

      expect(countMap).toEqual(expectedCountMap);
    });

    test("counts the number of every word in a string for a two word string where the words are different", () => {
      const fullSentence = "how do";
      const countMap = WordCount.allWordCount(fullSentence);

      const expectedCountMap = new Map<string, number>();
      expectedCountMap.set("how", 1).set("do", 1);

      expect(countMap).toEqual(expectedCountMap);
    });

    test("counts the frequency of every word in a string for a three word string where two of the words are the same", () => {
      const fullSentence = "how do how";
      const countMap = WordCount.allWordCount(fullSentence);

      const expectedCountMap = new Map<string, number>();
      expectedCountMap.set("how", 2).set("do", 1);

      expect(countMap).toEqual(expectedCountMap);
    });
  });

  describe("long form text", () => {
    test("single word in long block of text", () => {
      const wordToCount = "eggplant";

      const count = WordCount.singleWordCount(longform, wordToCount);
      expect(count).toBe(7);
    });

    test("counts the number of every word long form text", () => {
      const countMap = WordCount.allWordCount(longform);

      expect(countMap.get("the")).toEqual(16);
      expect(countMap.get("of")).toEqual(5);
      expect(countMap.get("with")).toEqual(4);
    });
  });

  describe("punctuation", () => {
    test("single question mark doesn't affect the count", () => {
      const wordToCount = "who";
      const fullSentence = "Who the who?";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("multiple question marks don't affect the count", () => {
      const wordToCount = "who";
      const fullSentence = "Who the who??";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("single exclamation mark doesn't affect the count", () => {
      const wordToCount = "who";
      const fullSentence = "Who the who!";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("multiple exclamation marks don't affect the count", () => {
      const wordToCount = "who";
      const fullSentence = "Who the who!!";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("single full stop doesn't affect the count", () => {
      const wordToCount = "who";
      const fullSentence = "Who the who.";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("multiple full stops don't affect the count", () => {
      const wordToCount = "who";
      const fullSentence = "Who the who..";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("punctuation can come in the middle of the sentence", () => {
      const wordToCount = "who";
      const fullSentence = "Who? the who..";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("punctuation doesn't affect the search", () => {
      const wordToCount = "who?";
      const fullSentence = "Who the who..";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(2);
    });

    test("protected words are counted as is", () => {
      const wordToCount = "Lock & Co";
      const fullSentence = "Lock & Co";
      const protectionList = ["Lock & Co"];
      const count = WordCount.singleWordCount(fullSentence, wordToCount, {
        protectionList
      });
      expect(count).toBe(1);
    });

    test("punctuated words aren't added to the map", () => {
      const fullSentence = "who the who?";
      const map = WordCount.allWordCount(fullSentence);
      const expectedCountMap = new Map<string, number>()
        .set("who", 2)
        .set("the", 1);

      expect(map).toEqual(expectedCountMap);
    });

    test("capitalised words aren't added to the map", () => {
      const fullSentence = "What the what";
      const map = WordCount.allWordCount(fullSentence);
      const expectedCountMap = new Map<string, number>()
        .set("what", 2)
        .set("the", 1);

      expect(map).toEqual(expectedCountMap);
    });

    test("protected words are added to the map as is", () => {
      const fullSentence = "Lock & Co";
      const map = WordCount.allWordCount(fullSentence, {
        protectionList: ["Lock & Co"]
      });
      const expectedCountMap = new Map<string, number>().set("Lock & Co", 1);

      expect(map).toEqual(expectedCountMap);
    });

    test("multi spaces don't affect the count", () => {
      const wordToCount = "who";
      const fullSentence = "Who    would  do something  like     that";
      const count = WordCount.singleWordCount(fullSentence, wordToCount);
      expect(count).toBe(1);
    });
  });

  describe("performance", () => {
    test("spaces aren't counted", () => {
      const fullSentence = "Who   the   who?";
      const countMap = WordCount.allWordCount(fullSentence);

      expect(countMap.get("")).toBeUndefined();
    });
  });
});

const longform = `As the sun dipped low on the horizon, casting a warm glow over the verdant fields, farmers gathered their bounty of freshly harvested vegetables. Among the crates overflowing with produce, it was the eggplant that stood out, its deep purple hue contrasting vividly against the earthy tones of the surrounding crops. With gentle hands, they carefully sorted the eggplant, selecting only the finest specimens to bring to market. Each eggplant, with its smooth skin and firm flesh, promised culinary delights for those fortunate enough to bring it home.

In bustling kitchens across the city, chefs wielded their knives with precision, preparing a feast fit for royalty. Eggplant reigned supreme on their cutting boards, destined to be transformed into exquisite dishes that would tantalize the taste buds of diners far and wide. From creamy eggplant moussaka to spicy eggplant curry, each creation showcased the versatility of this humble vegetable. As savory aromas filled the air, patrons eagerly awaited their meals, anticipating the moment when they would savor the rich flavors of the eggplant once more.`;
