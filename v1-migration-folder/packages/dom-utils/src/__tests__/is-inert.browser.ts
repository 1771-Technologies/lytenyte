import { describe, expect, test } from "vitest";
import { isInert } from "../is-inert.js";

describe("isInert", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");

    document.body.appendChild(el);

    expect(isInert(el)).toEqual(false);
    expect(isInert(null as unknown as HTMLElement)).toEqual(false);
  });
});
