import { describe, expect, test } from "vitest";
import { isFrame } from "./is-frame.js";

describe("isFrame", () => {
  test("Should return true when the element is an iframe and false otherwise", () => {
    expect(isFrame(document.createElement("iframe"))).toEqual(true);
    expect(isFrame(document.createElement("div"))).toEqual(false);
  });

  test("Should return false when the value is not a valid element", () => {
    expect(isFrame({})).toEqual(false);
  });
});
