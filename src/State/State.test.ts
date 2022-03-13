import { State } from "./State";

describe("state", () => {
  test("set and retrieve a movie", () => {
    const state = new State();
    state.setMovie({ Title: "movie one" });
    expect(state.getMovies()).toEqual(["movie one"]);
  });

  test("set and retrieve a movie with ratings", () => {
    const state = new State();
    state.setMovie({
      Title: "movie one",
      Ratings: [{ Source: "some source", Value: "5/10" }],
    });
    expect(state.getMovies()).toEqual(["movie one (some source Rating: 5/10)"]);
  });

  test("set and retrieve multiple movies", () => {
    const state = new State();
    state.setMovie({ Title: "movie two" });
    state.setMovie({ Title: "movie three" });

    expect(state.getMovies()).toEqual(["movie two", "movie three"]);
  });

  test("remove duplicate films (i.e. they have the same imdb id)", () => {
    const state = new State();
    state.setMovie({ Title: "movie two", imdbID: "tt1234567" });
    state.setMovie({ Title: "movie two", imdbID: "tt1234567" });
    state.makeUnique();

    expect(state.getMovies()).toEqual(["movie two"]);
  });

  test("the state can be wiped", () => {
    const state = new State();
    state.setMovie({ Title: "movie two" });
    state.setMovie({ Title: "movie three" });
    state.removies();

    expect(state.getMovies()).toEqual([]);
  });

  test("a single film can be removed from the state", () => {
    const state = new State();
    state.setMovie({ Title: "movie two" });
    state.setMovie({ Title: "movie three" });
    state.removie(1);

    expect(state.getMovies()).toEqual(["movie three"]);
  });
});
