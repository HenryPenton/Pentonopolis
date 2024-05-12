import { IClient } from "../client/client";
import { ISynchronousReader } from "../reader/reader";
import { NPMAudit, NPMAuditData } from "./audit";

describe("Audit", () => {
  test("sends a correctly formatted message", async () => {
    const stubClient: IClient = { sendMessage: jest.fn() };
    const stubReader: ISynchronousReader<NPMAuditData> = {
      read: (): NPMAuditData => {
        return {
          metadata: {
            vulnerabilities: {
              info: 1,
              low: 2,
              moderate: 3,
              high: 4,
              critical: 5
            }
          }
        };
      }
    };

    const audit = new NPMAudit(stubClient, stubReader);
    await audit.fire();

    expect(stubClient.sendMessage).toHaveBeenCalledWith(
      "Vulnerabilities: info: 1, low: 2, moderate: 3, high: 4, critical: 5"
    );
  });
});
