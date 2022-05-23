import { State } from "../../../State/State";
import {
  GetMoviePollResponse,
  PollNotReadyError,
} from "./GetMoviePollResponse";

describe("GetMoviePollResponse", () => {
  test("Throws a pollnotreadyerror when there are not enough movies", () => {
    const state = new State();
    const responseGenerate = () => {
      new GetMoviePollResponse(state).generateResponse();
    };
    expect(responseGenerate).toThrowError(PollNotReadyError);

    state.setMovie({ Title: "abcde", imdbID: "tt1234567" });
    expect(responseGenerate).toThrowError(PollNotReadyError);
  });

  test("returns a list of lists of strings when there are enough movies", () => {
    const state = new State();
    state.setMovie({ Title: "abcde", imdbID: "tt1234567" });
    state.setMovie({ Title: "edcba", imdbID: "tt7654321" });

    expect(new GetMoviePollResponse(state).generateResponse()).toEqual([
      ["abcde", "edcba"],
    ]);
  });

  test("a poll can have ten movies in it", () => {
    const state = new State();
    state.setMovie({ Title: "abcde" });
    state.setMovie({ Title: "edcba" });
    state.setMovie({ Title: "edcba" });
    state.setMovie({ Title: "edcba" });
    state.setMovie({ Title: "edcba" });
    state.setMovie({ Title: "edcba" });
    state.setMovie({ Title: "edcba" });
    state.setMovie({ Title: "edcba" });
    state.setMovie({ Title: "edcba" });
    state.setMovie({ Title: "edcba" });

    expect(new GetMoviePollResponse(state).generateResponse()).toEqual([
      [
        "abcde",
        "edcba",
        "edcba",
        "edcba",
        "edcba",
        "edcba",
        "edcba",
        "edcba",
        "edcba",
        "edcba",
      ],
    ]);
  });

  test("12 movies in the selection gets split into two polls of 10 and 2", () => {
    const state = new State();
    state.setMovie({ Title: "1" });
    state.setMovie({ Title: "2" });
    state.setMovie({ Title: "3" });
    state.setMovie({ Title: "4" });
    state.setMovie({ Title: "5" });
    state.setMovie({ Title: "6" });
    state.setMovie({ Title: "7" });
    state.setMovie({ Title: "8" });
    state.setMovie({ Title: "9" });
    state.setMovie({ Title: "10" });
    state.setMovie({ Title: "11" });
    state.setMovie({ Title: "12" });

    expect(new GetMoviePollResponse(state).generateResponse()).toEqual([
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      ["11", "12"],
    ]);
  });

  test("a number of movies that leaves a remainder of 1 when divided by ten, gets split into nines (min poll size is two, so remainder of 1 would get removed)", () => {
    const state = new State();
    state.setMovie({ Title: "1" });
    state.setMovie({ Title: "2" });
    state.setMovie({ Title: "3" });
    state.setMovie({ Title: "4" });
    state.setMovie({ Title: "5" });
    state.setMovie({ Title: "6" });
    state.setMovie({ Title: "7" });
    state.setMovie({ Title: "8" });
    state.setMovie({ Title: "9" });
    state.setMovie({ Title: "10" });
    state.setMovie({ Title: "11" });

    expect(new GetMoviePollResponse(state).generateResponse()).toEqual([
      ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      ["10", "11"],
    ]);
  });

  test("two duplicate movies+ no other movies causes a PollNotReadyError", () => {
    const state = new State();
    state.setMovie({ Title: "1", imdbID: "same" });
    state.setMovie({ Title: "1", imdbID: "same" });

    expect(new GetMoviePollResponse(state).generateResponse).toThrowError(
      PollNotReadyError
    );
  });

  test("two duplicate movies + 1 other movie raises a poll of two", () => {
    const state = new State();
    state.setMovie({ Title: "1", imdbID: "same" });
    state.setMovie({ Title: "1", imdbID: "same" });
    state.setMovie({ Title: "2", imdbID: "different" });

    expect(new GetMoviePollResponse(state).generateResponse()).toEqual([
      ["1", "2"],
    ]);
  });
});
