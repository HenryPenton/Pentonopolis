import { OutdatedData } from "../../outdated/outdated";
import { IValidator } from "../validator";

export class NpmOutdatedValidator implements IValidator<OutdatedData> {
  isValid = (): OutdatedData => {
    return {};
  };
}
