import { NPMAuditData } from "../audit/audit";
import { InvalidDataError } from "../errors/errors";
import { NpmAuditValidator } from "./NPMAuditValidator";
describe("npm audit validator", () => {
  const validAuditData: NPMAuditData = {
    metadata: {
      vulnerabilities: {
        info: 0,
        low: 0,
        moderate: 0,
        high: 0,
        critical: 0
      }
    }
  };
  test("returns data if its valid", () => {
    const npmAuditDataValidator = new NpmAuditValidator();

    expect(npmAuditDataValidator.isValid(validAuditData)).toEqual(
      validAuditData
    );
  });

  test("must have metadata", () => {
    const npmAuditDataValidator = new NpmAuditValidator();

    expect(() => npmAuditDataValidator.isValid({})).toThrow(
      new InvalidDataError("Metadata missing")
    );
  });

  test("must have vulnerabilities", () => {
    const npmAuditDataValidator = new NpmAuditValidator();

    expect(() => npmAuditDataValidator.isValid({ metadata: {} })).toThrow(
      new InvalidDataError("Vulnerabilities missing")
    );
  });
  test("must have info", () => {
    const npmAuditDataValidator = new NpmAuditValidator();

    expect(() =>
      npmAuditDataValidator.isValid({
        metadata: {
          vulnerabilities: {
            low: 0,
            moderate: 0,
            high: 0,
            critical: 0
          }
        }
      })
    ).toThrow(new InvalidDataError("Info count missing"));
  });
  test("must have low", () => {
    const npmAuditDataValidator = new NpmAuditValidator();

    expect(() =>
      npmAuditDataValidator.isValid({
        metadata: {
          vulnerabilities: {
            info: 0,
            moderate: 0,
            high: 0,
            critical: 0
          }
        }
      })
    ).toThrow(new InvalidDataError("Low count missing"));
  });
  test("must have moderate", () => {
    const npmAuditDataValidator = new NpmAuditValidator();

    expect(() =>
      npmAuditDataValidator.isValid({
        metadata: {
          vulnerabilities: {
            info: 0,
            low: 0,
            high: 0,
            critical: 0
          }
        }
      })
    ).toThrow(new InvalidDataError("Moderate count missing"));
  });
  test("must have high", () => {
    const npmAuditDataValidator = new NpmAuditValidator();

    expect(() =>
      npmAuditDataValidator.isValid({
        metadata: {
          vulnerabilities: {
            info: 0,
            low: 0,
            moderate: 0,
            critical: 0
          }
        }
      })
    ).toThrow(new InvalidDataError("High count missing"));
  });
  test("must have critical", () => {
    const npmAuditDataValidator = new NpmAuditValidator();

    expect(() =>
      npmAuditDataValidator.isValid({
        metadata: {
          vulnerabilities: {
            info: 0,
            low: 0,
            moderate: 0,
            high: 0
          }
        }
      })
    ).toThrow(new InvalidDataError("Critical count missing"));
  });
});
