import { mapAuditToMessage } from "./auditToMessageMapper";

describe("formatData", () => {
  test("data formatted correctly", async () => {
    const message = mapAuditToMessage(
      {
        metadata: {
          vulnerabilities: {
            info: 1,
            low: 2,
            moderate: 3,
            high: 4,
            critical: 5
          }
        }
      },
      "some-package"
    );

    expect(message).toEqual(
      "Vulnerabilities for some-package: info: 1, low: 2, moderate: 3, high: 4, critical: 5"
    );
  });
});
