import * as Frequency from "./frequency";

describe("frequencies", () => {
  describe("single frequency", () => {
    test("a single word sentence returns 100% frequency for that word", () => {
      const sentence = "why?";
      const frequency = Frequency.singleFrequencyCount(sentence, "why");

      expect(frequency).toBe(1);
    });

    test("a two word sentence returns 50% frequency for one of the words (the words are different)", () => {
      const sentence = "why not?";
      const frequency = Frequency.singleFrequencyCount(sentence, "not");

      expect(frequency).toBe(0.5);
    });

    test("a word that doesn't appear in the sentence has a frequency of 0%", () => {
      const sentence = "what is the time";
      const frequency = Frequency.singleFrequencyCount(sentence, "potatoes");

      expect(frequency).toBe(0);
    });

    test("protected word frequency is counted as is", () => {
      const sentence = "Lock & Co is a hatters in london";
      const frequency = Frequency.singleFrequencyCount(sentence, "Lock & Co", {
        protectionList: ["Lock & Co"]
      });

      expect(frequency).toBe(0.1667);
    });

    test("percentages are limited to four decimal places", () => {
      const sentence = "why not me?";
      const frequency = Frequency.singleFrequencyCount(sentence, "why");

      expect(frequency).toEqual(0.3333);
    });
  });

  describe("multi frequency", () => {
    test("a single word sentence returns a map with one word frequency of 100%", () => {
      const sentence = "why?";
      const frequencyMap = Frequency.allFrequencyCount(sentence);

      const expectedFrequencyMap = new Map<string, number>().set("why", 1);

      expect(frequencyMap).toEqual(expectedFrequencyMap);
    });

    test("a two word sentence returns 50% frequency for each of the words in a map (the words are different)", () => {
      const sentence = "why not?";
      const frequencyMap = Frequency.allFrequencyCount(sentence);

      const expectedFrequencyMap = new Map<string, number>()
        .set("why", 0.5)
        .set("not", 0.5);

      expect(frequencyMap).toEqual(expectedFrequencyMap);
    });

    test("a three word sentence returns 33.33% frequency for each of the words in a map (the words are different)", () => {
      const sentence = "why not me?";
      const frequencyMap = Frequency.allFrequencyCount(sentence);

      const expectedFrequencyMap = new Map<string, number>()
        .set("why", 0.3333)
        .set("not", 0.3333)
        .set("me", 0.3333);

      expect(frequencyMap).toEqual(expectedFrequencyMap);
    });

    test("protected word frequency is counted as part of the map", () => {
      const sentence = "Lock & Co is a hatters in london";
      const frequency = Frequency.allFrequencyCount(sentence, {
        protectionList: ["Lock & Co"]
      });
      const expectedFrequencyMap = new Map<string, number>()
        .set("Lock & Co", 0.1667)
        .set("is", 0.1667)
        .set("a", 0.1667)
        .set("hatters", 0.1667)
        .set("in", 0.1667)
        .set("london", 0.1667);

      expect(frequency).toEqual(expectedFrequencyMap);
    });
  });

  describe("long form text", () => {
    test("single word in long block of text", () => {
      const wordToCount = "eggplant";

      const count = Frequency.singleFrequencyCount(longform, wordToCount);
      const expectedFrequency = Number((2 / 57).toFixed(4));
      expect(count).toBe(expectedFrequency);
    });

    test("counts the number of every word long form text", () => {
      const frequencyMap = Frequency.allFrequencyCount(longform);

      const expectedTheFrequency = Number((5 / 57).toFixed(4));
      const expectedOfFrequency = Number((3 / 57).toFixed(4));
      const expectedWithFrequency = Number((1 / 57).toFixed(4));

      expect(frequencyMap.get("the")).toEqual(expectedTheFrequency);
      expect(frequencyMap.get("of")).toEqual(expectedOfFrequency);
      expect(frequencyMap.get("with")).toEqual(expectedWithFrequency);
    });
  });
});

const longform = `In Maria's kitchen, the aroma of garlic and onions filled the air as she prepared her signature dish, ratatouille. Among the veggies, the eggplant stood out, promising flavor with every slice.

At the market square, colorful displays of produce caught shoppers' eyes. Eggplant, tomatoes, and herbs begged to be picked, inspiring visions of delightful meals to come.`;
