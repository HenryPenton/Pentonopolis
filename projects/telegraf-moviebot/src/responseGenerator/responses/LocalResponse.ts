import { State } from "../../State/State";
import { Response } from "./Response";

export abstract class LocalResponse extends Response {
  state: State;
  constructor(state: State) {
    super();
    this.state = state;
  }
}
