import { getMovieRatings } from "./getMovieRatings";

describe("get movie ratings", () => {
  test("gets movie ratings", () => {
    expect(
      getMovieRatings({
        Title: "some film",
        Ratings: [{ Source: "abcde", Value: "1/2" }],
      })
    ).toBe("(abcde Rating: 1/2)");
  });

  test("shortens internet movie database to imdb", () => {
    expect(
      getMovieRatings({
        Title: "some film",
        Ratings: [{ Source: "Internet Movie Database", Value: "1/2" }],
      })
    ).toBe("(IMDb Rating: 1/2)");
  });
});
