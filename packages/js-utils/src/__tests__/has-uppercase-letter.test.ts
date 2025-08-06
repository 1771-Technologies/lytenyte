import { describe, expect, test } from "vitest";
import { hasUpperCaseLetter } from "../has-uppercase-letter";

describe("hasUppercaseLetter", () => {
  test("should return the correct result", () => {
    expect(hasUpperCaseLetter("Afa")).toEqual(true);
    expect(hasUpperCaseLetter("afa ade")).toEqual(false);
    expect(hasUpperCaseLetter("afa adE")).toEqual(true);
    expect(hasUpperCaseLetter("afa ads.f!")).toEqual(false);
  });
});
