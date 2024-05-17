import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class GetMovieResponse extends LocalResponse {
  constructor(state: State) {
    super(state);
  }

  fire = (): string => {
    const movieSelection = this.state.getMovies();
    if (movieSelection.length === 0) {
      return "No movies have been set yet";
    } else {
      let movies = "";
      movieSelection.forEach((movie, index) => {
        const indexedMovie = `${index + 1}. ${movie}`;
        if (index === 0) {
          movies = indexedMovie;
        } else {
          movies = `${movies}\n${indexedMovie}`;
        }
      });
      return movies;
    }
  };
}
