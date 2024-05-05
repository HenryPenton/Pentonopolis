import { SearchType } from "../../../commands";
import * as MF from "../../../fetcher/movie/movieFetcher";
import { State } from "../../../State/State";
import { SetMovieResponse } from "./SetMovieResponse";

describe("only command given", () => {
  test("only movie command given", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "",
      state,
      SearchType.WITH_SEARCH_TERM
    );

    expect(await setMovieResponse.fire()).toBe("Please specify a movie!");
  });

  test("only movieyear command given", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "",
      state,
      SearchType.WITH_YEAR
    );

    expect(await setMovieResponse.fire()).toBe(
      "Please specify a movie and year!"
    );
  });

  test("only movieid command given", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "",
      state,
      SearchType.WITH_ID
    );

    expect(await setMovieResponse.fire()).toBe("Please specify an IMDB ID!");
  });

  test("only movieid command given", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "",
      state,
      SearchType.WITH_ID
    );

    expect(await setMovieResponse.fire()).toBe("Please specify an IMDB ID!");
  });

  test("non existent state", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "",
      state,
      "some non existent search type" as unknown as SearchType
    );

    expect(await setMovieResponse.fire()).toBe("Something went wrong!");
  });
});

describe("movie responses with just title", () => {
  test("get a movie by imdb id", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "tt12345457",
      state,
      SearchType.WITH_ID
    );
    jest
      .spyOn(MF, "getMovieWithID")
      .mockResolvedValueOnce({ Title: "thingy movie", imdbID: "tt12345457" });
    expect(await setMovieResponse.fire()).toBe(
      "thingy movie added to the film selection"
    );
    expect(state.getMovies()).toEqual(["thingy movie"]);
  });

  test("get a movie by title", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "Finding nemo",
      state,
      SearchType.WITH_SEARCH_TERM
    );
    jest.spyOn(MF, "getMovie").mockResolvedValueOnce({ Title: "Finding nemo" });
    expect(await setMovieResponse.fire()).toBe(
      "Finding nemo added to the film selection"
    );
    expect(state.getMovies()).toEqual(["Finding nemo"]);
  });

  test("get a movie by with year", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "thingy movie (1996)",
      state,
      SearchType.WITH_YEAR
    );
    jest
      .spyOn(MF, "getMovieWithYear")
      .mockResolvedValueOnce({ Title: "thingy movie" });
    expect(await setMovieResponse.fire()).toBe(
      "thingy movie added to the film selection"
    );
    expect(state.getMovies()).toEqual(["thingy movie"]);
  });
});

describe("unknown movie", () => {
  test("no response movie", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "thingy movie (1996)",
      state,
      SearchType.WITH_YEAR
    );

    jest
      .spyOn(MF, "getMovieWithYear")
      .mockResolvedValueOnce({ Response: "False" });

    expect(await setMovieResponse.fire()).toBe(`Couldn't find that film`);
  });

  test("no title movie", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "thingy movie (1996)",
      state,
      SearchType.WITH_YEAR
    );

    jest
      .spyOn(MF, "getMovieWithYear")
      .mockResolvedValueOnce({ Title: undefined });

    expect(await setMovieResponse.fire()).toBe(`Couldn't find that film`);
  });
});

describe("movie responses with other information", () => {
  const genericMovieInfo: Partial<MF.Movie> = {
    Runtime: "runtime",
    Director: "director",
    Ratings: [{ Source: "sriracha", Value: "tasty" }],
    Plot: "dude where is my automobile",
    Year: "1995",
  };
  test("movie with multiple ratings", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "tt12345457",
      state,
      SearchType.WITH_ID
    );
    jest.spyOn(MF, "getMovieWithID").mockResolvedValueOnce({
      Title: "thingy movie",
      imdbID: "tt12345457",
      ...genericMovieInfo,
    });
    expect(await setMovieResponse.fire()).toBe(
      `thingy movie (sriracha Rating: tasty) added to the film selection`
    );
  });
});

describe("multi movie", () => {
  const genericMovieInfo: Partial<MF.Movie> = {
    Runtime: "runtime",
    Director: "director",
    Ratings: [{ Source: "sriracha", Value: "tasty" }],
    Plot: "dude where is my automobile",
    Year: "1995",
  };
  test("multiple movies", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "abcde%%edcba%%vwxyz",
      state,
      SearchType.WITH_SEARCH_TERM
    );
    jest
      .spyOn(MF, "getMovie")
      .mockResolvedValueOnce({
        Title: "abcde",
        imdbID: "tt12345457",
        ...genericMovieInfo,
      })
      .mockResolvedValueOnce({
        Title: "edcba",
        imdbID: "tt7654321",
        ...genericMovieInfo,
      })
      .mockResolvedValueOnce({
        Title: "vwxyz",
        imdbID: "tt9876543",
        ...genericMovieInfo,
      });
    expect(await setMovieResponse.fire()).toBe(
      `abcde (sriracha Rating: tasty), edcba (sriracha Rating: tasty) and vwxyz (sriracha Rating: tasty) added to the film selection`
    );
  });

  test("multiple movies not found", async () => {
    const state = new State();
    const setMovieResponse = new SetMovieResponse(
      "abcde%%edcba%%vwxyz",
      state,
      SearchType.WITH_SEARCH_TERM
    );
    jest.spyOn(MF, "getMovie");

    expect(await setMovieResponse.fire()).toBe(`Couldn't find those films`);
  });
});
