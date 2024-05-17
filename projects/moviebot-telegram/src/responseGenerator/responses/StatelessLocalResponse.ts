import { Response } from "./Response";

export abstract class StatelessLocalResponse extends Response {
  abstract fire: () => string;
}
