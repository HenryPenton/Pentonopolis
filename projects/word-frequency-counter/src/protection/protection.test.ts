import { Protection } from "./protection";
describe("protection", () => {
  test("protects a word by replacing it with a random string", () => {
    const dummyRandomStringGenerator = jest.fn().mockReturnValueOnce("abcdefg");

    const preservation = new Protection(["word"], dummyRandomStringGenerator);
    const protectedText = preservation.addWordProtection(
      "this sentence contains a word"
    );

    expect(protectedText).toEqual("this sentence contains a abcdefg");
  });

  test("protects multiple words by replacing them with random strings", () => {
    const dummyRandomStringGenerator = jest
      .fn()
      .mockReturnValueOnce("abcdefg")
      .mockReturnValueOnce("gfedcba");

    const preservation = new Protection(
      ["word", "potato"],
      dummyRandomStringGenerator
    );
    const protectedText = preservation.addWordProtection(
      "this sentence contains a potato word"
    );

    expect(protectedText).toEqual("this sentence contains a gfedcba abcdefg");
  });

  test("unprotects a word by replacing the random string with the original word", () => {
    const dummyRandomStringGenerator = jest.fn().mockReturnValueOnce("abcdefg");

    const preservation = new Protection(["word"], dummyRandomStringGenerator);

    const unprotectedText = preservation.removeWordProtection(
      "this sentence contains a abcdefg"
    );

    expect(unprotectedText).toEqual("this sentence contains a word");
  });

  test("unprotects multiple words by replacing the random strings with the original words", () => {
    const dummyRandomStringGenerator = jest
      .fn()
      .mockReturnValueOnce("abcdefg")
      .mockReturnValueOnce("gfedcba");

    const preservation = new Protection(
      ["word", "potato"],
      dummyRandomStringGenerator
    );

    const unprotectedText = preservation.removeWordProtection(
      "this sentence contains a gfedcba abcdefg"
    );

    expect(unprotectedText).toEqual("this sentence contains a potato word");
  });
});
