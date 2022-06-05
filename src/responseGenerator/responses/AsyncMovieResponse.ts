import { SearchType } from "../../commands";
import {
  getMovie,
  getMovieWithID,
  getMovieWithYear,
  Movie,
} from "../../fetcher/movie/movieFetcher";
import { Response } from "./Response";

export class MovieNotProvidedError extends Error {}
export class MovieAndYearNotProvidedError extends Error {}
export class MovieIDNotProvided extends Error {}

export abstract class AsyncMovieResponse extends Response {
  movie: Movie;
  searchType: SearchType;
  queryString: string;
  constructor(queryString: string, searchType: SearchType) {
    super();
    this.movie = {};
    this.queryString = queryString;
    this.searchType = searchType;
  }

  protected getMovie = async () => {
    switch (this.searchType) {
      case SearchType.WITH_YEAR: {
        if (this.queryString === "") throw new MovieAndYearNotProvidedError();

        const querySplit = this.queryString.split(" ");
        const movieYear = querySplit[querySplit.length - 1];

        querySplit.pop();
        const queryStringWithoutYear = querySplit.join(" ");
        return getMovieWithYear(queryStringWithoutYear, movieYear);
      }
      case SearchType.WITH_ID:
        if (this.queryString === "") throw new MovieIDNotProvided();
        return getMovieWithID(this.queryString);

      case SearchType.WITH_SEARCH_TERM:
        if (this.queryString === "") throw new MovieNotProvidedError();
        return getMovie(this.queryString);
    }
  };

  protected generateErrorReponse = (e: unknown) => {
    switch (true) {
      case e instanceof MovieNotProvidedError:
        return "Please specify a movie!";
      case e instanceof MovieIDNotProvided:
        return "Please specify an IMDB ID!";
      case e instanceof MovieAndYearNotProvidedError:
        return "Please specify a movie and year!";
      default:
        return "Something went wrong!";
    }
  };
}
