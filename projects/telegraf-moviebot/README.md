# Moviebot Telegram

An open movie database bot written in typescript.

```javascript
//index.js
import { init } from "moviebot-telegram";
init();
```

```bash
MOVIE_DATABASE_KEY=somekey
TELEGRAM_BOT_TOKEN=sometoken
YOUTUBE_API_KEY=somekey node index.js
ANONYMOUS_POLLS=<true||false>
```

MOVIE_DATABASE_KEY is an API key for the [Open Movie Database](http://www.omdbapi.com/).

TELEGRAM_BOT_TOKEN is a bot token received by talking to the BotFather on Telegram.

## Commands

## help

Running /help will get you all of the following commands

## movie

Running /movie _movieName_ will return you information for _movieName_, if it exists.

If you supplied a Youtube API key in the first stage, you should also get trailers in the message.

## movieyear

Running /movieyear _movieName_ _movieYear_ will return you information for _movieName_, if it exists with extra filtering to ensure its from the correct year.

## movieid

Running /movieid _imdbID_ will return information about the film relating to that imdb id

If you supplied a Youtube API key in the first stage, you should also get trailers in the message.

**Setting movies**

_The selection mentioned in the following setmovie commands will be wiped if the bot is ever restarted_

## setmovie

Running /setmovie _movieName_ will add _movieName_ to the movie selection.

Running /setmovie _movieName%%otherMovieName_ will add _movieName_ and _otherMovieName_ to the selection. You can separate as many movies as you wish with %% - only those which have successful calls to the omdb will be added to the selection.

## setmovieyear

Running /setmovieyear _movieName_ _movieYear_ will add _movieName_, if it exist for the given year, to the selection.

## setmovieid

Running /setmovieid _imdbID_ will add the movie relating to that imdb id to the selection.

## getmovies

Running /getmovies will return you all of the movies set previously using the any of the setmovie commands.

## moviepoll

Running /moviepoll will return you all of the movies you set previously using the setmovie command, but in the format of a poll.

## removie

Running /removie _movieid_ where movieid is the id returned by getmovies will remove that movie from the selection

Running /removie _moviename_ will attempt to match the movie name to one of the movies in the selection and remove it. If unsuccessful nothing will be removed. If the string matches multiple items in the selection, the most recently added will be removed.

## reset

Running /reset will wipe the entire movie selection

## cleanup

Running /cleanup will remove any duplicates from the movie selection based on imdb id

## votes

Running /votes will tell you the state of votes in the latest moviepoll

# Changelog

## 6.4.1

- Update dependencies

## 6.4.0

- Update dependencies

## 6.3.8

- Update dependencies

## 6.3.7

- Update dependencies

## 6.3.6

- Update dependencies

## 6.3.5

- Update dependencies

## 6.3.4

- Update dependencies

## 6.3.3

- Update dependencies

## 6.3.2

- Update dependencies

## 6.3.1

- Update dependencies

## 6.3.0

- Polls can be made anonymous or non-anonymous by providing the boolean environment variable ANONYMOUS_POLLS. Defaults to true.

## 6.2.12

- Update dev dependencies

## 6.2.11

- None

## 6.2.10

- None

## 6.2.9

- None

## 6.2.8

- None

## 6.2.7

- Remove old package lock

## 6.2.6

- Switch to pnpm

## 6.2.5

- Update packages

## 6.2.4

- Update packages

## 6.2.3

- Write tests for vote response
- Respond with no votes found if all vote counts are 0
- Fix state references

## 6.2.2

- General tidy up

## 6.2.1

- General code improvements, improved coverage and tidiness

## 6.2.0

- Requesting a moviepoll will reset any running poll
- Error handling for movie/movieid/movieyear commands that are sent without any other information
- Package updates

## 6.1.0

- Format votes with HTML parser to allow bold and underlined titles for vote headings
- Remove undefined movie ratings from returned strings

## 6.0.3

- Typo in changelog

## 6.0.2

- Update modules

## 6.0.1

- Don't print films with no votes when running the /votes command

## 6.0.0

- Move to telegraf library as it is still currently maintained
- Update dependencies

## 5.5.2

- resolve node-fetch security issue
- change compatibility to node 14 or later

## 5.5.1

- general updates to packages

## 5.5.0

- movie command followed by an imdb id will now reroute to movieid command
- setmovie command followed by an imdb id will now reroute to setmovieid command

## 5.4.2

- Dependency updates

## 5.4.1

- Fixed bug whereby movie selections with a length 1 greater than telegram's limit would only send a single poll.

## 5.4.0

- Duplicates are removed from movie selections before a poll is sent

## 5.3.1

- Dependency updates

## 5.2.1

- Improved separation of concerns

## 5.2.0

- Added /help command

## 5.1.2

- Moved types to more appropriate places

## 5.1.1

- Fixed linting issue that stopped deployment of 5.1.0

## 5.1.0

- Movie voting changed to track a user's id rather than username, as not all users have a username. This caused some peoples votes to be missed.
- ESLint added to the project with recommended typescript settings. Resultant linting errors fixed.
