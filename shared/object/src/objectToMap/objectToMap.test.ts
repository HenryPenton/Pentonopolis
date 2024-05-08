import { objectToMap } from "./objectToMap";

describe("object to map", () => {
  test("convert an object to a map", () => {
    expect(objectToMap({})).toEqual(new Map());
  });

  test("convert an object to a map", () => {
    const expectedMap = new Map().set("aaaaaa", "thing");
    expect(objectToMap({ aaaaaa: "thing" })).toEqual(expectedMap);
  });
});
