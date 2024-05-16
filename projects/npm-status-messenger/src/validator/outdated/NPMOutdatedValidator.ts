import { InvalidDataError } from "../../errors/errors";
import { OutdatedData } from "../../outdated/outdated";
import { IValidator } from "../validator";

export class NpmOutdatedValidator implements IValidator<OutdatedData> {
  validate = (data: unknown): OutdatedData => {
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
