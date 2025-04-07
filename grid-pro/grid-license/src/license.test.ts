import { activateLicense } from "./license";

describe("activateLicense", () => {
  test("valid license", () => {
    const license =
      "2023-01-01 2024-01-01 citadel company-wide myrandomstring|c1c808278b02303e818ceebc901bd6f3";

    expect(activateLicense(license)).toBe(true);
  });
  test("invalid license", () => {
    const license =
      "2023-01-01 2024-01-01 citadel company-wide myrandomstring|c1c818278b02303e818ceebc901bd6f3";

    expect(activateLicense(license)).toBe(false);
  });
  test("expired license", () => {
    const license =
      "2021-01-01 2022-01-01 citadel company-wide myrandomstring|0ee005723a07b4e4d4c97e9c61072a5d";
    expect(activateLicense(license)).toBe(false);
  });
});
