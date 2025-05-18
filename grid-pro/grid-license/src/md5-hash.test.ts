import { getHash } from "./md5-hash.js";

describe("activateLicense", () => {
  test("valid license", () => {
    const license =
      "2023-01-01 2024-01-01 citadel company-wide myrandomstring|c1c808278b02303e818ceebc901bd6f3";

    expect(
      getHash({
        companyName: "citadel",
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        licenseType: "company-wide",
        randomString: "myrandomstring",
      }),
    ).toBe(license);
  });
  test("invalid license", () => {
    const license =
      "2023-01-01 2024-01-01 citadel seated myrandomstring|c1c818278b02303e818ceebc901bd6f3";

    expect(
      getHash({
        companyName: "citadel",
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        licenseType: "company-wide",
        randomString: "myrandomstring",
      }),
    ).not.toBe(license);
  });
});
