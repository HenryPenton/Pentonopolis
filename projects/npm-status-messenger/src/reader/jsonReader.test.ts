import { NPMAuditData } from "../audit/audit";
import { InvalidDataError } from "../errors/errors";
import { IValidator, JSONReader } from "./jsonReader";
describe("JSON Reader", () => {
  test("reader reads", () => {
    const dummyReaderFileSync = jest.fn().mockReturnValue(
      JSON.stringify({
        metadata: {
          vulnerabilities: {
            info: 1,
            low: 1,
            high: 1,
            moderate: 1,
            critical: 1
          }
        }
      })
    );
    const dummyValidator: IValidator<NPMAuditData> = {
      isValid: jest.fn().mockReturnValue(true)
    };
    const reader = new JSONReader<NPMAuditData>(
      dummyReaderFileSync,
      dummyValidator
    );
    const data = reader.read("path/to/file");

    expect(data).toEqual({
      metadata: {
        vulnerabilities: { info: 1, low: 1, high: 1, moderate: 1, critical: 1 }
      }
    });
    expect(dummyReaderFileSync).toHaveBeenCalledWith("path/to/file", "utf-8");
  });

  test("reader reads data if validator returns valid", () => {
    const dummyReaderFileSync = jest.fn().mockReturnValue(
      JSON.stringify({
        metadata: {
          vulnerabilities: {
            info: 1,
            low: 1,
            high: 1,
            moderate: 1,
            critical: 1
          }
        }
      })
    );
    const dummyValidator: IValidator<NPMAuditData> = {
      isValid: jest.fn().mockReturnValue(true)
    };

    const reader = new JSONReader<NPMAuditData>(
      dummyReaderFileSync,
      dummyValidator
    );

    const data = reader.read("path/to/file");
    expect(data).toEqual({
      metadata: {
        vulnerabilities: { info: 1, low: 1, high: 1, moderate: 1, critical: 1 }
      }
    });
  });

  test("reader throws invalid data error if validator returns not valid", () => {
    const dummyReaderFileSync = jest.fn().mockReturnValue(
      JSON.stringify({
        metadata: {
          vulnerabilities: {
            info: 1,
            low: 1,
            high: 1,
            moderate: 1,
            critical: 1
          }
        }
      })
    );
    const dummyValidator: IValidator<NPMAuditData> = {
      isValid: jest.fn().mockReturnValue(false)
    };

    const reader = new JSONReader<NPMAuditData>(
      dummyReaderFileSync,
      dummyValidator
    );

    const attemptdata = (): NPMAuditData => reader.read("path/to/file");
    expect(attemptdata).toThrow(InvalidDataError);
  });
});
