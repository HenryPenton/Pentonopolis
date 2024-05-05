export enum SearchType {
  WITH_YEAR,
  WITH_ID,
  WITH_SEARCH_TERM,
}

export enum Commands {
  movie = "movie",
  movieyear = "movieyear",
  movieid = "movieid",
  setmovie = "setmovie",
  setmovieyear = "setmovieyear",
  setmovieid = "setmovieid",
  getmovies = "getmovies",
  moviepoll = "moviepoll",
  removie = "removie",
  reset = "reset",
  cleanup = "cleanup",
  votes = "votes",
  help = "help",
}
