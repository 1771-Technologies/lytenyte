import { describe, expect, test } from "vitest";
import { isFrame } from "../is-frame.js";

describe("isFrame", () => {
  test("when the element is an iframe element it should return true", () => {
    expect(isFrame(document.createElement("iframe"))).toEqual(true);
    expect(isFrame(document.createElement("div"))).toEqual(false);
  });

  test("when the element is not valid it should return false", () => {
    expect(isFrame({})).toEqual(false);
  });
});
