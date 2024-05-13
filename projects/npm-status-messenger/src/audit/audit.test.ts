import { IClient } from "../client/client";
import { ISynchronousReader } from "../reader/reader";
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
});
