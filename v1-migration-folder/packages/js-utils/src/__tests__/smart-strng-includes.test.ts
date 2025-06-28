import { describe, expect, test } from "vitest";
import { smartStringIncludes } from "../smart-string-includes";

describe("smartStringIncludes", () => {
  test("should return the correct result", () => {
    expect(smartStringIncludes("Alpha", "alp")).toEqual(true);
    expect(smartStringIncludes("Beta", "Bet")).toEqual(true);
    expect(smartStringIncludes("beta", "Bet")).toEqual(false);
    expect(smartStringIncludes("     beta  ", " bet")).toEqual(true);
  });
});
