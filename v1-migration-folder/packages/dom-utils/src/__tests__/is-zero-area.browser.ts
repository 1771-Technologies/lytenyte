import { describe, expect, test } from "vitest";
import { isZeroArea } from "../is-zero-area.js";

describe("isZeroArea", () => {
  test("returns true when width and height are both 0", () => {
    const div = document.createElement("div");

    // Mock getBoundingClientRect
    div.getBoundingClientRect = () => ({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    expect(isZeroArea(div)).toBe(true);
  });

  test("returns false when width is non-zero", () => {
    const div = document.createElement("div");

    div.getBoundingClientRect = () => ({
      width: 100,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    expect(isZeroArea(div)).toBe(false);
  });

  test("returns false when height is non-zero", () => {
    const div = document.createElement("div");

    div.getBoundingClientRect = () => ({
      width: 0,
      height: 50,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    expect(isZeroArea(div)).toBe(false);
  });

  test("returns false when both width and height are non-zero", () => {
    const div = document.createElement("div");

    div.getBoundingClientRect = () => ({
      width: 120,
      height: 80,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    expect(isZeroArea(div)).toBe(false);
  });
});
