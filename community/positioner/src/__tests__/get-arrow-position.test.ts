import { getArrowPosition } from "../get-arrow-position.js";
import type { Dimensions } from "../types.js";

describe("getArrowPosition", () => {
  const floating: Dimensions = {
    width: 100,
    height: 100,
  };

  const arrow: Dimensions = {
    width: 20,
    height: 10,
  };

  describe("vertical axis (top/bottom placement)", () => {
    test("centers arrow horizontally when no alignment specified", () => {
      // When floating element is on top, arrow points down (bottom)
      const positionTop = getArrowPosition("top", undefined, 0, 0, floating, arrow);
      expect(positionTop).toEqual({
        x: 40, // (100 - 20) / 2
        y: 100, // floating.height
      });

      // When floating element is on bottom, arrow points up (top)
      const positionBottom = getArrowPosition("bottom", undefined, 0, 0, floating, arrow);
      expect(positionBottom).toEqual({
        x: 40, // (100 - 20) / 2
        y: -10, // -arrow.height
      });
    });

    test("aligns arrow to start for vertical placements", () => {
      const positionTop = getArrowPosition("top", "start", 0, 0, floating, arrow);
      expect(positionTop).toEqual({
        x: 0,
        y: 100, // floating.height
      });

      const positionBottom = getArrowPosition("bottom", "start", 0, 0, floating, arrow);
      expect(positionBottom).toEqual({
        x: 0,
        y: -10, // -arrow.height
      });
    });

    test("aligns arrow to end for vertical placements", () => {
      const positionTop = getArrowPosition("top", "end", 0, 0, floating, arrow);
      expect(positionTop).toEqual({
        x: 80, // floating.width - arrow.width
        y: 100, // floating.height
      });

      const positionBottom = getArrowPosition("bottom", "end", 0, 0, floating, arrow);
      expect(positionBottom).toEqual({
        x: 80, // floating.width - arrow.width
        y: -10, // -arrow.height
      });
    });
  });

  describe("horizontal axis (left/right placement)", () => {
    test("centers arrow vertically when no alignment specified", () => {
      // When floating element is on left, arrow points right
      const positionLeft = getArrowPosition("left", undefined, 0, 0, floating, arrow);
      expect(positionLeft).toEqual({
        x: 100, // floating.width
        y: 45, // (100 - 10) / 2
      });

      // When floating element is on right, arrow points left
      const positionRight = getArrowPosition("right", undefined, 0, 0, floating, arrow);
      expect(positionRight).toEqual({
        x: -20, // -arrow.width
        y: 45, // (100 - 10) / 2
      });
    });

    test("aligns arrow to start for horizontal placements", () => {
      const positionLeft = getArrowPosition("left", "start", 0, 0, floating, arrow);
      expect(positionLeft).toEqual({
        x: 100, // floating.width
        y: 0,
      });

      const positionRight = getArrowPosition("right", "start", 0, 0, floating, arrow);
      expect(positionRight).toEqual({
        x: -20, // -arrow.width
        y: 0,
      });
    });

    test("aligns arrow to end for horizontal placements", () => {
      const positionLeft = getArrowPosition("left", "end", 0, 0, floating, arrow);
      expect(positionLeft).toEqual({
        x: 100, // floating.width
        y: 90, // floating.height - arrow.height
      });

      const positionRight = getArrowPosition("right", "end", 0, 0, floating, arrow);
      expect(positionRight).toEqual({
        x: -20, // -arrow.width
        y: 90, // floating.height - arrow.height
      });
    });
  });

  describe("edge cases", () => {
    test("handles zero dimensions", () => {
      const zeroFloating: Dimensions = { width: 0, height: 0 };
      const zeroArrow: Dimensions = { width: 0, height: 0 };

      const position = getArrowPosition("top", undefined, 0, 0, zeroFloating, zeroArrow);
      expect(position).toEqual({
        x: 0, // (0 - 0) / 2
        y: 0, // zeroFloating.height
      });
    });

    test("handles large arrow dimensions", () => {
      const largeArrow: Dimensions = {
        width: 200, // wider than floating element
        height: 200, // taller than floating element
      };

      const position = getArrowPosition("top", undefined, 0, 0, floating, largeArrow);
      expect(position).toEqual({
        x: -50, // (100 - 200) / 2
        y: 100, // floating.height
      });
    });

    test("handles odd dimensions with floor rounding", () => {
      const oddFloating: Dimensions = { width: 101, height: 101 };
      const oddArrow: Dimensions = { width: 21, height: 11 };

      const position = getArrowPosition("top", undefined, 0, 0, oddFloating, oddArrow);
      expect(position).toEqual({
        x: 40, // Math.floor((101 - 21) / 2)
        y: 101, // oddFloating.height
      });
    });

    test("initial x/y coordinates are ignored", () => {
      // The function should ignore the initial x/y coordinates
      const position = getArrowPosition("top", undefined, 50, 50, floating, arrow);
      expect(position).toEqual({
        x: 40, // (100 - 20) / 2, ignoring initial x
        y: 100, // floating.height, ignoring initial y
      });
    });
  });
});
