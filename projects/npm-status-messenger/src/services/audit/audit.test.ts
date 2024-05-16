import { IClient } from "../../client/client";
import { NoDataAvailableError } from "../../errors/dataErrors";
import { ISynchronousReader } from "../../reader/reader";
import { NPMAudit, NPMAuditData } from "./audit";

describe("Audit", () => {
  test("sends a correctly formatted message", () => {
    const stubClient: IClient = { sendMessage: jest.fn() };

    const mockRead = jest.fn().mockReturnValue({
      metadata: {
        vulnerabilities: {
          info: 1,
          low: 2,
          moderate: 3,
          high: 4,
          critical: 5
        }
      }
    });

    const stubReader: ISynchronousReader<NPMAuditData> = {
      read: mockRead
    };

    const audit = new NPMAudit(stubClient, stubReader);
    audit.fire("path/to/audit/file");

    expect(stubClient.sendMessage).toHaveBeenCalledWith(
      "Vulnerabilities: info: 1, low: 2, moderate: 3, high: 4, critical: 5"
    );
    expect(mockRead).toHaveBeenCalledWith("path/to/audit/file");
  });

  test("sends a warning if vulnerability data not found", () => {
    const stubClient: IClient = { sendMessage: jest.fn() };

    const stubReader: ISynchronousReader<NPMAuditData> = {
      read: () => {
        throw new NoDataAvailableError();
      }
    };

    const audit = new NPMAudit(stubClient, stubReader);
    audit.fire("path/to/audit/file");

    expect(stubClient.sendMessage).toHaveBeenCalledWith(
      "No parseable vulnerability data could be found"
    );
  });
});
