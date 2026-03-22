import { describe, expect, test } from "vitest";
import { isFullyWithinRect } from "./is-fully-within-rect.js";
import type { DataRect } from "../types.js";

describe("isFullyWithinRect", () => {
  const rect: DataRect = { rowStart: 2, rowEnd: 8, columnStart: 2, columnEnd: 8 };

  test("Should return true when pos is strictly interior and shares no edges with rect", () => {
    const pos: DataRect = { rowStart: 3, rowEnd: 6, columnStart: 3, columnEnd: 6 };
    expect(isFullyWithinRect(pos, rect)).toBe(true);
  });

  test("Should return false when pos shares rowStart with rect", () => {
    const pos: DataRect = { rowStart: 2, rowEnd: 6, columnStart: 3, columnEnd: 6 };
    expect(isFullyWithinRect(pos, rect)).toBe(false);
  });

  test("Should return false when pos shares rowEnd with rect", () => {
    const pos: DataRect = { rowStart: 3, rowEnd: 8, columnStart: 3, columnEnd: 6 };
    expect(isFullyWithinRect(pos, rect)).toBe(false);
  });

  test("Should return false when pos shares columnStart with rect", () => {
    const pos: DataRect = { rowStart: 3, rowEnd: 6, columnStart: 2, columnEnd: 6 };
    expect(isFullyWithinRect(pos, rect)).toBe(false);
  });

  test("Should return false when pos shares columnEnd with rect", () => {
    const pos: DataRect = { rowStart: 3, rowEnd: 6, columnStart: 3, columnEnd: 8 };
    expect(isFullyWithinRect(pos, rect)).toBe(false);
  });

  test("Should return false when pos shares multiple edges with rect", () => {
    const pos: DataRect = { rowStart: 2, rowEnd: 6, columnStart: 2, columnEnd: 6 };
    expect(isFullyWithinRect(pos, rect)).toBe(false);
  });

  test("Should return false when pos is identical to rect", () => {
    expect(isFullyWithinRect(rect, rect)).toBe(false);
  });
});
