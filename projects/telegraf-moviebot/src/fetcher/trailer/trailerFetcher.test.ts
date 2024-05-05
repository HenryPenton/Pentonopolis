import * as FETCH from "../fetcher";
import { getTrailer, YoutubeResponse } from "./trailerFetcher";

describe("movie fetcher", () => {
  test("get trailer successful", async () => {
    const youtubeResponse: YoutubeResponse = {
      items: [{ id: { videoId: "abcde" } }],
    };

    jest
      .spyOn(FETCH, "fetcher")
      .mockResolvedValue(youtubeResponse as unknown as FETCH.UnknownObject);
    expect(await getTrailer("abcde")).toEqual(
      "https://www.youtube.co.uk/watch?v=abcde"
    );
  });

  test("get trailer fails", async () => {
    jest.spyOn(FETCH, "fetcher").mockRejectedValue(new Error("oops"));
    expect(await getTrailer("abcde")).toEqual("");
  });
});
