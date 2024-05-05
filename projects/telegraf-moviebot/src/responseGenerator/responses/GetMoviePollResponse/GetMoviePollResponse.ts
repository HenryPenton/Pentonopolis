import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class PollNotReadyError extends Error {}

export class GetMoviePollResponse extends LocalResponse {
  movies: string[];
  pollReady: boolean;
  maxPollLength: number;
  minPollLength: number;

  constructor(state: State) {
    super(state);
    this.state.makeUnique();
    this.movies = this.state.getMovies();
    this.pollReady = this.isPollReady();
    this.maxPollLength = 10;
    this.minPollLength = 9;
  }
  isPollReady = (): boolean => this.movies.length >= 2;

  fire = (): string[][] => {
    if (this.pollReady) {
      this.state.resetPolls();

      const options = [];

      const remainder = this.movies.length % 10;
      const remainderIsOne = remainder === 1;

      const pollSize = remainderIsOne ? this.minPollLength : this.maxPollLength;

      for (let index = 0; index < this.movies.length; index += pollSize) {
        options.push(this.movies.slice(index, index + pollSize));
      }
      return options;
    } else {
      throw new PollNotReadyError();
    }
  };
}
