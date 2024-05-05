import * as FETCH from "../fetcher";
import { getMovie, getMovieWithID, getMovieWithYear } from "./movieFetcher";

describe("movie fetcher", () => {
  test("get movie successful", async () => {
    jest.spyOn(FETCH, "fetcher").mockResolvedValue({ Title: "xyz" });
    expect(await getMovie("abcde")).toEqual({ Title: "xyz" });
  });

  test("get movie fails", async () => {
    jest.spyOn(FETCH, "fetcher").mockRejectedValue(new Error("oops"));
    expect(await getMovie("abcde")).toEqual({ Response: "False" });
  });

  test("get movie successful", async () => {
    jest.spyOn(FETCH, "fetcher").mockResolvedValue({ Title: "xyz" });
    expect(await getMovieWithID("abcde")).toEqual({ Title: "xyz" });
  });

  test("get movie fails", async () => {
    jest.spyOn(FETCH, "fetcher").mockRejectedValue(new Error("oops"));
    expect(await getMovieWithID("abcde")).toEqual({ Response: "False" });
  });

  test("get movie successful", async () => {
    jest.spyOn(FETCH, "fetcher").mockResolvedValue({ Title: "xyz" });
    expect(await getMovieWithYear("abcde", "1234")).toEqual({ Title: "xyz" });
  });

  test("get movie fails", async () => {
    jest.spyOn(FETCH, "fetcher").mockRejectedValue(new Error("oops"));
    expect(await getMovieWithYear("abcde", "1234")).toEqual({
      Response: "False",
    });
  });
});
