import { IClient } from "../../client/client";
import { NoDataAvailableError } from "../../errors/dataErrors";
import { ISynchronousReader } from "../../reader/reader";
import { NPMAudit, NPMAuditData } from "./audit";

describe("Audit", () => {
  test.each([
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1]
  ])(
    "sends correctly formatted messages",
    (info, low, moderate, high, critical) => {
      const stubClient: IClient = { sendMessage: jest.fn() };

      const mockRead = jest.fn().mockReturnValue({
        metadata: {
          vulnerabilities: {
            info,
            low,
            moderate,
            high,
            critical
          }
        }
      });

      const stubReader: ISynchronousReader<NPMAuditData> = {
        read: mockRead
      };

      const audit = new NPMAudit(stubClient, stubReader, "some-package");
      audit.fire("path/to/audit/file");

      expect(stubClient.sendMessage).toHaveBeenCalledWith(
        `Vulnerabilities for some-package: info: ${info}, low: ${low}, moderate: ${moderate}, high: ${high}, critical: ${critical}`
      );
      expect(mockRead).toHaveBeenCalledWith("path/to/audit/file");
    }
  );

  test("sends a warning if vulnerability data not found", () => {
    const stubClient: IClient = { sendMessage: jest.fn() };

    const stubReader: ISynchronousReader<NPMAuditData> = {
      read: () => {
        throw new NoDataAvailableError();
      }
    };

    const audit = new NPMAudit(stubClient, stubReader, "some-package");
    audit.fire("path/to/audit/file");

    expect(stubClient.sendMessage).toHaveBeenCalledWith(
      "No parseable vulnerability data could be found"
    );
  });

  test("doesn't send a message if there are no vulnerabilities", () => {
    const stubClient: IClient = { sendMessage: jest.fn() };

    const stubReader: ISynchronousReader<NPMAuditData> = {
      read: () => {
        return {
          metadata: {
            vulnerabilities: {
              low: 0,
              moderate: 0,
              high: 0,
              info: 0,
              critical: 0
            }
          }
        };
      }
    };

    const audit = new NPMAudit(stubClient, stubReader, "some-package");
    audit.fire("path/to/audit/file");

    expect(stubClient.sendMessage).not.toHaveBeenCalled();
  });
});
