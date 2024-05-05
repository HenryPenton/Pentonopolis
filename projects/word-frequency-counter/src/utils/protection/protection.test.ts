import { Protection } from "./protection";

describe("protection", () => {
  test("protects a word by replacing it with a random string", () => {
    jest.spyOn(Math, "random").mockImplementation(() => 0.4);

    const preservation = new Protection(["word"]);
    const protectedText = preservation.addWordProtection(
      "this sentence contains a word"
    );

    expect(protectedText).toEqual("this sentence contains a oooooooooo");
  });

  test("protects multiple words by replacing them with random strings", () => {
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.3)
      .mockImplementationOnce(() => 0.1)
      .mockImplementation(() => 0.4);

    const preservation = new Protection(["word", "potato"]);
    const protectedText = preservation.addWordProtection(
      "this sentence contains a potato word"
    );

    expect(protectedText).toEqual(
      "this sentence contains a oooooooooo kdoooooooo"
    );
  });

  test("unprotects a word by replacing the random string with the original word", () => {
    jest.spyOn(Math, "random").mockImplementation(() => 0.4);

    const preservation = new Protection(["word"]);

    const unprotectedText = preservation.removeWordProtection(
      "this sentence contains a oooooooooo"
    );

    expect(unprotectedText).toEqual("this sentence contains a word");
  });

  test("unprotects multiple words by replacing the random strings with the original words", () => {
    jest
      .spyOn(Math, "random")
      .mockImplementationOnce(() => 0.3)
      .mockImplementationOnce(() => 0.1)
      .mockImplementation(() => 0.4);

    const preservation = new Protection(["word", "potato"]);
    const unprotectedText = preservation.removeWordProtection(
      "this sentence contains a oooooooooo kdoooooooo"
    );

    expect(unprotectedText).toEqual("this sentence contains a potato word");
  });
});

describe("protection with override string generator", () => {
  test("protects a word by replacing it with a random string", () => {
    const overrideGenerator = (): string => "aaaaa";

    const preservation = new Protection(["word"], overrideGenerator);
    const protectedText = preservation.addWordProtection(
      "this sentence contains a word"
    );

    expect(protectedText).toEqual("this sentence contains a aaaaa");
  });

  test("protects multiple words by replacing them with random strings", () => {
    const overrideGenerator = jest
      .fn()
      .mockReturnValueOnce("aaaaa")
      .mockReturnValueOnce("bbbbb");

    const preservation = new Protection(["word", "potato"], overrideGenerator);
    const protectedText = preservation.addWordProtection(
      "this sentence contains a potato word"
    );

    expect(protectedText).toEqual("this sentence contains a bbbbb aaaaa");
  });

  test("unprotects a word by replacing the random string with the original word", () => {
    const overrideGenerator = (): string => "aaaaa";

    const preservation = new Protection(["word"], overrideGenerator);

    const unprotectedText = preservation.removeWordProtection(
      "this sentence contains a aaaaa"
    );

    expect(unprotectedText).toEqual("this sentence contains a word");
  });

  test("unprotects multiple words by replacing the random strings with the original words", () => {
    const overrideGenerator = jest
      .fn()
      .mockReturnValueOnce("aaaaa")
      .mockReturnValueOnce("bbbbb");

    const preservation = new Protection(["word", "potato"], overrideGenerator);
    const unprotectedText = preservation.removeWordProtection(
      "this sentence contains a bbbbb aaaaa"
    );

    expect(unprotectedText).toEqual("this sentence contains a potato word");
  });
});
