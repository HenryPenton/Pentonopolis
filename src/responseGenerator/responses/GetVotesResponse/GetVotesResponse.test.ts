import { GetVotesResponse } from "./GetVotesResponse";
import { State } from "../../../State/State";

describe("GetVotesResponse", () => {
  test("handles no votes in state", () => {
    const state = new State();

    const votesResponse = new GetVotesResponse(state);
    const response = votesResponse.generateResponse();
    expect(response).toBe("Could not find any votes");
  });

  test("handles single movie with no votes", () => {
    const state = new State();

    state.setMovie({ Title: "abc" });
    state.updateVotesForPoll([{ text: "abc", voter_count: 0 }]);
    const votesResponse = new GetVotesResponse(state);
    const response = votesResponse.generateResponse();

    expect(response).toBe("Could not find any votes");
  });

  test("handles single movie with 1 vote", () => {
    const state = new State();

    state.setMovie({ Title: "abc" });
    state.updateVotesForPoll([{ text: "abc", voter_count: 1 }]);
    const votesResponse = new GetVotesResponse(state);
    const response = votesResponse.generateResponse();
    expect(response).toBe("<b><u>1 vote:</u></b>\nabc\n");
  });

  test("handles single movie with 2 votes", () => {
    const state = new State();

    state.setMovie({ Title: "abc" });
    state.updateVotesForPoll([{ text: "abc", voter_count: 2 }]);
    const votesResponse = new GetVotesResponse(state);
    const response = votesResponse.generateResponse();
    expect(response).toBe("<b><u>2 votes:</u></b>\nabc\n");
  });

  test("handles two movies with 1 vote each", () => {
    const state = new State();

    state.setMovie({ Title: "abc" });
    state.setMovie({ Title: "xyz" });
    state.updateVotesForPoll([{ text: "abc", voter_count: 1 }]);
    state.updateVotesForPoll([{ text: "xyz", voter_count: 1 }]);
    const votesResponse = new GetVotesResponse(state);
    const response = votesResponse.generateResponse();
    expect(response).toBe("<b><u>1 vote:</u></b>\nabc\nxyz\n");
  });

  test("handles two movies with different numbers of votes", () => {
    const state = new State();

    state.setMovie({ Title: "abc" });
    state.setMovie({ Title: "xyz" });
    state.updateVotesForPoll([{ text: "abc", voter_count: 1 }]);
    state.updateVotesForPoll([{ text: "xyz", voter_count: 2 }]);
    const votesResponse = new GetVotesResponse(state);
    const response = votesResponse.generateResponse();
    expect(response).toBe(
      "<b><u>2 votes:</u></b>\nxyz\n<b><u>1 vote:</u></b>\nabc\n"
    );
  });
});
