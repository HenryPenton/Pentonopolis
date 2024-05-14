import { NPMAuditData } from "../audit/audit";
import { InvalidDataError } from "../errors/errors";
import { IValidator } from "./validator";

export class NpmAuditValidator implements IValidator<NPMAuditData> {
  isValid = (data: unknown): NPMAuditData => {
    const potentialData = data as NPMAuditData;

    if (potentialData.metadata === undefined) {
      throw new InvalidDataError("Metadata missing");
    }

    if (potentialData.metadata.vulnerabilities === undefined) {
      throw new InvalidDataError("Vulnerabilities missing");
    }

    if (potentialData.metadata.vulnerabilities.info === undefined) {
      throw new InvalidDataError("Info count missing");
    }
    if (potentialData.metadata.vulnerabilities.low === undefined) {
      throw new InvalidDataError("Low count missing");
    }
    if (potentialData.metadata.vulnerabilities.moderate === undefined) {
      throw new InvalidDataError("Moderate count missing");
    }
    if (potentialData.metadata.vulnerabilities.high === undefined) {
      throw new InvalidDataError("High count missing");
    }
    if (potentialData.metadata.vulnerabilities.critical === undefined) {
      throw new InvalidDataError("Critical count missing");
    }

    const { info, low, moderate, high, critical } =
      potentialData.metadata.vulnerabilities;

    const validatedData: NPMAuditData = {
      metadata: {
        vulnerabilities: {
          info,
          low,
          moderate,
          high,
          critical
        }
      }
    };

    return validatedData;
  };
}
