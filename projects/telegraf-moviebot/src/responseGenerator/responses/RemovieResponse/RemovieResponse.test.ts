import { State } from "../../../State/State";
import { RemovieResponse } from "./RemovieResponse";

type DummyRemovie = (id: number) => string | undefined;

describe("RemovieResponse", () => {
  test("responds that it cannot remove a movie that is not in the selection", () => {
    const state = new State();
    expect(
      new RemovieResponse(state, "barry goes to hollywood").fire()
    ).toEqual(`Couldn't find that film in the selection`);
  });

  test("remove a movie by name", () => {
    const state = new State();
    state.setMovie({ Title: "barry goes to hollywood" });

    expect(
      new RemovieResponse(state, "barry goes to hollywood").fire()
    ).toEqual(`barry goes to hollywood removed from the selection`);
  });

  test("remove a movie by human id (1 indexed)", () => {
    const state = new State();
    state.setMovie({ Title: "barry goes to hollywood" });

    expect(new RemovieResponse(state, "1").fire()).toEqual(
      `barry goes to hollywood removed from the selection`
    );
  });

  test("attempts to remove a non existent film from state", () => {
    const state = new State();
    state.setMovie({ Title: "barry goes to hollywood" });
    const x: DummyRemovie = (id: number) => {
      id;
      return undefined;
    };
    state.removie = x;

    expect(
      new RemovieResponse(state, "barry goes to hollywood").fire()
    ).toEqual(`Couldn't find that film in the selection`);
  });

  // test("attempts to remove a non existent film from state", () => {
  //   const state = new State();
  //   state.setMovie({ Title: "barry goes to hollywood" });
  //   const x: DummyRemovie = (id: number) => {
  //     id;
  //     return undefined;
  //   };
  //   state.removie = x;

  //   expect(
  //     new RemovieResponse(state, "barry goes to hollywood").fire()
  //   ).toEqual(`Couldn't find that film in the selection`);
  // });
});
