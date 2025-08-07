import { describe, expect, test } from "vitest";
import { resolveAlignment } from "../resolve-alignment.js";

describe("resolveAlignment", () => {
  test("should return the correct alignment", () => {
    expect(resolveAlignment("center")).toEqual("");
    expect(resolveAlignment("start")).toEqual("-start");
    expect(resolveAlignment("end")).toEqual("-end");
  });
});
