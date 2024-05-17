import { Commands } from "../../../commands";
import { helpDefinitions } from "./helpDefinitions";
import { HelpResponse } from "./HelpResponse";

describe("GetVotesResponse", () => {
  test("responds with the help blurb", () => {
    expect(
      new HelpResponse(helpDefinitions, Object.keys(Commands)).fire()
    ).toEqual(
      `\nmovie: Get information about a movie by name\nmovieyear: Get information about a movie by its year, where the format is /movieyear moviename YYYY\nmovieid: Get information about a movie by imdb id\nsetmovie: Sets a movie in the selection by name\nsetmovieyear: Sets a movie in the selection by its year, where the format is /movieyear moviename YYYY\nsetmovieid: Sets a movie in the selection by imdb id\ngetmovies: Get the movie selection\nmoviepoll: Get a movie poll in the form of a telegram vote!\nremovie: Remove a movie by the id given in /getmovies or by name - if a partial name is given, the first match will be removed\nreset: Resets the movie selection\ncleanup: Removes any duplicate movies from the selection\nvotes: Get the voting status on the current movie poll\nhelp: Get this list`
    );
  });
});
