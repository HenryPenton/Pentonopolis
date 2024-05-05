import { generateRandomStrings } from "./generator";

describe("random strings", () => {
  test("generates one random string", () => {
    const randomStrings = generateRandomStrings(1);
    expect(randomStrings.size).toBe(1);
  });
  test("string is 10 chars long", () => {
    const randomStrings = generateRandomStrings(1);
    expect(randomStrings.values().next().value).toHaveLength(10);
  });
  test("generates two random strings", () => {
    const randomStrings = generateRandomStrings(2);
    expect(randomStrings.size).toBe(2);
  });

  test("generates more random strings", () => {
    const randomStrings = generateRandomStrings(27);
    expect(randomStrings.size).toBe(27);
  });

  test("can take an override generator", () => {
    const override: () => string = () => "aaaaa12345";
    const randomStrings = generateRandomStrings(1, override);

    //although these two strings are not unique, it is the responsibility of the provider of the override to make sure the random string generator is random
    //the purpose of this test is checking that the override is used, not that it generates good values
    expect(randomStrings.values().next().value).toEqual("aaaaa12345");
  });

  test("should throw an error if the override generator generates something non alpha numeric", () => {
    const override: () => string = () => ";aaaa!a12345;";
    expect(() => generateRandomStrings(1, override)).toThrow(
      "The override generator provided generated a non alphanumeric string"
    );
  });

  test("should throw an error if the override generator generates something with a non numeric character in the middle", () => {
    const override: () => string = () => "aaaa!a12345";
    expect(() => generateRandomStrings(1, override)).toThrow(
      "The override generator provided generated a non alphanumeric string"
    );
  });

  test("should throw an error if the override generator generates something non lower case", () => {
    const override: () => string = () => "ABCDE12345";
    expect(() => generateRandomStrings(2, override)).toThrow(
      "The override generator provided generated a string containing capital letters"
    );
  });

  test("should throw an error if the built in generator generates two of the same random string", () => {
    jest.spyOn(Math, "random").mockImplementation(() => 0.3);
    expect(() => generateRandomStrings(2)).toThrow(
      "It looks like Math.random generated the same 'random' string twice! Sorry about that, you may wish to provide an override generator."
    );
  });

  test("should throw an error if the override generator generates two of the same random string", () => {
    const override: () => string = () => "abcde98765";

    expect(() => generateRandomStrings(2, override)).toThrow(
      "It looks like the override generator you provided generated the same 'random' string twice!"
    );
  });
});
