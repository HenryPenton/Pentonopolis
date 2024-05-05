import { State } from "../../../State/State";
import { GetMovieResponse } from "./GetMovieResponse";

describe("GetMovieResponse", () => {
  test("response says no movies have been set if no movies have been set", () => {
    const state = new State();

    expect(new GetMovieResponse(state).fire()).toEqual(
      "No movies have been set yet"
    );
  });

  test("response is one movie if one movie has been set", () => {
    const state = new State();
    state.setMovie({ Title: "thingy" });
    expect(new GetMovieResponse(state).fire()).toEqual("1. thingy");
  });

  test("response is multiple movies if multiple movies have been set", () => {
    const state = new State();
    state.setMovie({ Title: "thingy" });
    state.setMovie({ Title: "other thingy" });
    expect(new GetMovieResponse(state).fire()).toEqual(
      "1. thingy\n2. other thingy"
    );
  });
});
