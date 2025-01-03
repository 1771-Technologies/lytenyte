import { getOffset } from "../get-offset.js";
import type { OffsetValue } from "../types.js";

describe("getOffset", () => {
  describe("number offset", () => {
    test("handles top placement", () => {
      const offset = getOffset("top", undefined, 10, false);
      expect(offset).toEqual({
        x: 0,
        y: -10, // negative because top side
      });
    });

    test("handles bottom placement", () => {
      const offset = getOffset("bottom", undefined, 10, false);
      expect(offset).toEqual({
        x: 0,
        y: 10, // positive because bottom side
      });
    });

    test("handles left placement", () => {
      const offset = getOffset("left", undefined, 10, false);
      expect(offset).toEqual({
        x: -10, // negative because left side
        y: 0,
      });
    });

    test("handles right placement", () => {
      const offset = getOffset("right", undefined, 10, false);
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

      const topOffset = getOffset("top", undefined, offsetValue, false);
      expect(topOffset).toEqual({
        x: 5, // crossAxis
        y: -10, // -mainAxis for top
      });

      const rightOffset = getOffset("right", undefined, offsetValue, false);
      expect(rightOffset).toEqual({
        x: 10, // mainAxis
        y: 5, // crossAxis
      });
    });

    test("defaults to 0 when axes not specified", () => {
      const offsetValue: OffsetValue = {};

      const offset = getOffset("top", undefined, offsetValue, false);
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
      const topOffset = getOffset("top", "start", offsetWithAlignment, false);
      expect(topOffset).toEqual({
        x: 8, // alignmentAxis overrides crossAxis
        y: -10, // -mainAxis for top
      });
    });

    test("inverts alignment axis for end alignment", () => {
      const topOffset = getOffset("top", "end", offsetWithAlignment, false);
      expect(topOffset).toEqual({
        x: -8, // -alignmentAxis for end alignment
        y: -10, // -mainAxis for top
      });
    });

    test("ignores alignment axis when alignment is undefined", () => {
      const topOffset = getOffset("top", undefined, offsetWithAlignment, false);
      expect(topOffset).toEqual({
        x: 5, // uses crossAxis
        y: -10, // -mainAxis for top
      });
    });
  });

  describe("RTL support", () => {
    test("inverts cross axis for vertical placements in RTL", () => {
      const offsetValue: OffsetValue = {
        mainAxis: 10,
        crossAxis: 5,
      };

      // RTL should affect crossAxis for vertical placements
      const topOffsetRTL = getOffset("top", undefined, offsetValue, true);
      expect(topOffsetRTL).toEqual({
        x: -5, // inverted crossAxis
        y: -10, // unchanged mainAxis
      });

      // RTL should not affect crossAxis for horizontal placements
      const rightOffsetRTL = getOffset("right", undefined, offsetValue, true);
      expect(rightOffsetRTL).toEqual({
        x: 10, // unchanged mainAxis
        y: 5, // unchanged crossAxis
      });
    });

    test("affects alignment axis in RTL mode", () => {
      const offsetWithAlignment: OffsetValue = {
        mainAxis: 10,
        alignmentAxis: 8,
      };

      const topOffsetRTL = getOffset("top", "start", offsetWithAlignment, true);
      expect(topOffsetRTL).toEqual({
        x: -8, // inverted alignmentAxis
        y: -10, // unchanged mainAxis
      });
    });
  });

  describe("edge cases", () => {
    test("handles zero offsets", () => {
      const offset = getOffset("top", undefined, 0, false);
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

      const offset = getOffset("top", "start", offsetValue, false);
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

      const offset = getOffset("top", undefined, offsetValue, false);
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

      const offset = getOffset("top", "start", offsetValue, false);
      expect(offset).toEqual({
        x: 5, // uses crossAxis when alignmentAxis is null
        y: -10,
      });
    });
  });
});
