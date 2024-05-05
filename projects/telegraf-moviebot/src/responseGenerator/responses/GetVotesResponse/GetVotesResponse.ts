import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class GetVotesResponse extends LocalResponse {
  noVotesResponse: string;
  constructor(state: State) {
    super(state);
    this.noVotesResponse = "Could not find any votes";
  }

  fire = (): string => {
    const movieVotes = this.state
      .getPolls()
      .sort((a, b) => b.voter_count - a.voter_count);

    if (movieVotes.length === 0) return this.noVotesResponse;

    let currentMaxVote = 0;
    let allVotes = "";

    for (let index = 0; index < movieVotes.length; index++) {
      const { text, voter_count } = movieVotes[index];
      const numberOfVotes = voter_count;

      const noVotes = numberOfVotes === 0;
      if (noVotes) continue;

      const pluralised = numberOfVotes > 1 ? "votes" : "vote";

      if (currentMaxVote !== voter_count) {
        currentMaxVote = voter_count;
        allVotes += `<b><u>${currentMaxVote} ${pluralised}:</u></b>\n`;
      }

      allVotes += `${text}\n`;
    }

    if (allVotes === "") {
      return this.noVotesResponse;
    }

    return allVotes;
  };
}
