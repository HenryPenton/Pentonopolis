import { State } from "../../../State/State";
import { RemoviesResponse } from "./RemoviesResponse";

describe("removies response", () => {
  test("blob", () => {
    const state = new State();
    expect(new RemoviesResponse(state).fire()).toEqual(
      "The movie selection has been reset"
    );
  });
});
