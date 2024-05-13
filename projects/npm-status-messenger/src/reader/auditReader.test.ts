import { AuditReader } from "./auditReader";

describe("Telegram Client", () => {
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
    const reader = new AuditReader(dummyReaderFileSync);
    const data = reader.read("path/to/file");

    expect(data).toEqual({
      metadata: {
        vulnerabilities: { info: 1, low: 1, high: 1, moderate: 1, critical: 1 }
      }
    });
    expect(dummyReaderFileSync).toHaveBeenCalledWith("path/to/file", "utf-8");
  });
});
