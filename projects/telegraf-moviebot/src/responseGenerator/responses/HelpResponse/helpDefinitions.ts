import { HelpDefinitions } from "./HelpResponse";

const yearFormat = `, where the format is /movieyear moviename YYYY`;
const setsAMovie = `Sets a movie in the selection `;
const getsAMovie = `Get information about a movie by `;

export const helpDefinitions: HelpDefinitions = {
  cleanup: `Removes any duplicate movies from the selection`,
  getmovies: `Get the movie selection`,
  help: `Get this list`,
  movie: `${getsAMovie}name`,
  movieid: `${getsAMovie}imdb id`,
  moviepoll: `Get a movie poll in the form of a telegram vote!`,
  movieyear: `${getsAMovie}its year${yearFormat}`,
  removie: `Remove a movie by the id given in /getmovies or by name - if a partial name is given, the first match will be removed`,
  reset: `Resets the movie selection`,
  setmovie: `${setsAMovie}by name`,
  setmovieid: `${setsAMovie}by imdb id`,
  setmovieyear: `${setsAMovie}by its year${yearFormat}`,
  votes: `Get the voting status on the current movie poll`,
};
