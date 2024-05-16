import { InvalidDataError } from "../../errors/dataErrors";
import { OutdatedData } from "../../services/outdated/outdated";
import { IValidator } from "../validator";

export class NpmOutdatedValidator implements IValidator<OutdatedData> {
  validate = (data: unknown): OutdatedData => {
    if (!(data instanceof Object)) {
      throw new InvalidDataError("Invalid outdated data");
    }

    const potentialData = data as OutdatedData;
    const dataMap = new Map(Object.entries(potentialData));
    const actualOutdatedData: OutdatedData = {};
    dataMap.forEach((dataPoint, key) => {
      if (dataPoint.current && dataPoint.latest) {
        actualOutdatedData[key] = dataPoint;
      } else {
        throw new InvalidDataError("Invalid outdated data");
      }
    });
    return actualOutdatedData;
  };
}
