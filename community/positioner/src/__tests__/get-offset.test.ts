import { describe, it, expect } from "vitest";
import { getOffset } from "../get-offset.js";

describe("getOffset", () => {
  // Test all sides with positive offset
  describe("with positive offset", () => {
    const offset = 10;

    it("should offset upward for top placement", () => {
      expect(getOffset("top", offset)).toEqual({ x: 0, y: -10 });
    });

    it("should offset downward for bottom placement", () => {
      expect(getOffset("bottom", offset)).toEqual({ x: 0, y: 10 });
    });

    it("should offset leftward for left placement", () => {
      expect(getOffset("left", offset)).toEqual({ x: -10, y: 0 });
    });

    it("should offset rightward for right placement", () => {
      expect(getOffset("right", offset)).toEqual({ x: 10, y: 0 });
    });
  });

  // Test all sides with negative offset
  describe("with negative offset", () => {
    const offset = -10;

    it("should offset downward for top placement", () => {
      expect(getOffset("top", offset)).toEqual({ x: 0, y: 10 });
    });

    it("should offset upward for bottom placement", () => {
      expect(getOffset("bottom", offset)).toEqual({ x: 0, y: -10 });
    });

    it("should offset rightward for left placement", () => {
      expect(getOffset("left", offset)).toEqual({ x: 10, y: 0 });
    });

    it("should offset leftward for right placement", () => {
      expect(getOffset("right", offset)).toEqual({ x: -10, y: 0 });
    });
  });

  // Test decimal offsets
  describe("with decimal offset", () => {
    const offset = 10.5;

    it("should handle decimal offsets for vertical placement", () => {
      expect(getOffset("top", offset)).toEqual({ x: 0, y: -10.5 });
      expect(getOffset("bottom", offset)).toEqual({ x: 0, y: 10.5 });
    });

    it("should handle decimal offsets for horizontal placement", () => {
      expect(getOffset("left", offset)).toEqual({ x: -10.5, y: 0 });
      expect(getOffset("right", offset)).toEqual({ x: 10.5, y: 0 });
    });
  });

  // Test large numbers
  describe("with large offset values", () => {
    const offset = 1000000;

    it("should handle large numbers correctly", () => {
      expect(getOffset("top", offset)).toEqual({ x: 0, y: -1000000 });
      expect(getOffset("right", offset)).toEqual({ x: 1000000, y: 0 });
    });
  });
});
