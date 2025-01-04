import { getOffset } from "../get-offset.js";
import type { OffsetValue } from "../types.js";

describe("getOffset", () => {
  describe("number offset", () => {
    test("handles top placement", () => {
      const offset = getOffset("top", undefined, 10);
      expect(offset).toEqual({
        x: 0,
        y: -10, // negative because top side
      });
    });

    test("handles bottom placement", () => {
      const offset = getOffset("bottom", undefined, 10);
      expect(offset).toEqual({
        x: 0,
        y: 10, // positive because bottom side
      });
    });

    test("handles left placement", () => {
      const offset = getOffset("left", undefined, 10);
      expect(offset).toEqual({
        x: -10, // negative because left side
        y: 0,
      });
    });

    test("handles right placement", () => {
      const offset = getOffset("right", undefined, 10);
      expect(offset).toEqual({
        x: 10, // positive because right side
        y: 0,
      });
    });
  });

  describe("object offset", () => {
    test("handles main and cross axis offsets", () => {
      const offsetValue: OffsetValue = {
        mainAxis: 10,
        crossAxis: 5,
      };

      const topOffset = getOffset("top", undefined, offsetValue);
      expect(topOffset).toEqual({
        x: 5, // crossAxis
        y: -10, // -mainAxis for top
      });

      const rightOffset = getOffset("right", undefined, offsetValue);
      expect(rightOffset).toEqual({
        x: 10, // mainAxis
        y: 5, // crossAxis
      });
    });

    test("defaults to 0 when axes not specified", () => {
      const offsetValue: OffsetValue = {};

      const offset = getOffset("top", undefined, offsetValue);
      expect(offset).toEqual({
        x: 0,
        y: -0,
      });
    });
  });

  describe("alignment axis", () => {
    const offsetWithAlignment: OffsetValue = {
      mainAxis: 10,
      crossAxis: 5,
      alignmentAxis: 8,
    };

    test("applies alignment axis for start alignment", () => {
      const topOffset = getOffset("top", "start", offsetWithAlignment);
      expect(topOffset).toEqual({
        x: 8, // alignmentAxis overrides crossAxis
        y: -10, // -mainAxis for top
      });
    });

    test("inverts alignment axis for end alignment", () => {
      const topOffset = getOffset("top", "end", offsetWithAlignment);
      expect(topOffset).toEqual({
        x: -8, // -alignmentAxis for end alignment
        y: -10, // -mainAxis for top
      });
    });

    test("ignores alignment axis when alignment is undefined", () => {
      const topOffset = getOffset("top", undefined, offsetWithAlignment);
      expect(topOffset).toEqual({
        x: 5, // uses crossAxis
        y: -10, // -mainAxis for top
      });
    });
  });

  describe("edge cases", () => {
    test("handles zero offsets", () => {
      const offset = getOffset("top", undefined, 0);
      expect(offset).toEqual({
        x: 0,
        y: -0,
      });
    });

    test("handles negative offsets", () => {
      const offsetValue: OffsetValue = {
        mainAxis: -10,
        crossAxis: -5,
        alignmentAxis: -8,
      };

      const offset = getOffset("top", "start", offsetValue);
      expect(offset).toEqual({
        x: -8, // alignmentAxis
        y: 10, // mainAxis inverted because top placement
      });
    });

    test("handles decimal offsets", () => {
      const offsetValue: OffsetValue = {
        mainAxis: 10.5,
        crossAxis: 5.7,
      };

      const offset = getOffset("top", undefined, offsetValue);
      expect(offset).toEqual({
        x: 5.7,
        y: -10.5,
      });
    });

    test("handles null alignment axis", () => {
      const offsetValue: OffsetValue = {
        mainAxis: 10,
        crossAxis: 5,
        alignmentAxis: null,
      };

      const offset = getOffset("top", "start", offsetValue);
      expect(offset).toEqual({
        x: 5, // uses crossAxis when alignmentAxis is null
        y: -10,
      });
    });
  });
});
