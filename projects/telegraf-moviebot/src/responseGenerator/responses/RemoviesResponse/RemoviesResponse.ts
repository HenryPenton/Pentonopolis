import { State } from "../../../State/State";
import { LocalResponse } from "../LocalResponse";

export class RemoviesResponse extends LocalResponse {
  constructor(state: State) {
    super(state);
  }

  fire = (): string => {
    this.state.removies();
    this.state.resetPolls();
    return "The movie selection has been reset";
  };
}
