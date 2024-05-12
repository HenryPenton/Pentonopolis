import { mapAuditToMessage } from "../mappers/auditToMessageMapper";

describe("formatData", () => {
  test("data formatted correctly", async () => {
    const message = mapAuditToMessage({
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

    expect(message).toEqual(
      "Vulnerabilities: info: 1, low: 2, moderate: 3, high: 4, critical: 5"
    );
  });
});
