import { getPosition } from "../get-position.js";
import type { Rect, Dimensions } from "../types.js";

describe("getPosition", () => {
  // Mock window dimensions
  beforeEach(() => {
    vi.stubGlobal("window", {
      innerWidth: 1024,
      innerHeight: 768,
    });
  });

  const reference: Rect = {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
  };

  const floating: Dimensions = {
    width: 200,
    height: 150,
  };

  describe("basic positioning", () => {
    test("positions on bottom with default offset", () => {
      const position = getPosition({
        reference,
        floating,
        placement: "bottom",
      });

      expect(position).toMatchInlineSnapshot(`
        {
          "height": 150,
          "placement": "bottom",
          "width": 200,
          "x": 50,
          "y": 204,
        }
      `);
    });

    test("positions on top with custom offset", () => {
      const position = getPosition({
        reference,
        floating,
        placement: "top",
        offset: 10,
      });

      expect(position).toMatchInlineSnapshot(`
        {
          "height": 150,
          "placement": "bottom",
          "width": 200,
          "x": 50,
          "y": 210,
        }
      `);
    });

    test("positions with alignment", () => {
      const position = getPosition({
        reference,
        floating,
        placement: "right-start",
        offset: 5,
      });

      expect(position).toMatchInlineSnapshot(`
        {
          "height": 150,
          "placement": "right-start",
          "width": 200,
          "x": 205,
          "y": 100,
        }
      `);
    });
  });

  describe("collision handling", () => {
    test("shifts to opposite side when would overflow right", () => {
      const rightEdgeReference: Rect = {
        x: 900,
        y: 100,
        width: 100,
        height: 100,
      };

      const position = getPosition({
        reference: rightEdgeReference,
        floating,
        placement: "right",
        offset: 4,
      });

      // Should flip to left side since right would overflow
      expect(position.x).toBeLessThan(rightEdgeReference.x);
    });

    test("shifts to opposite side when would overflow left", () => {
      const leftEdgeReference: Rect = {
        x: 50,
        y: 100,
        width: 100,
        height: 100,
      };

      const position = getPosition({
        reference: leftEdgeReference,
        floating,
        placement: "left",
        offset: 4,
      });

      // Should flip to right side since left would overflow
      expect(position.x).toBeGreaterThan(leftEdgeReference.x);
    });

    test("shifts vertically when would overflow bottom", () => {
      const bottomEdgeReference: Rect = {
        x: 100,
        y: 650,
        width: 100,
        height: 100,
      };

      const position = getPosition({
        reference: bottomEdgeReference,
        floating,
        placement: "bottom",
        offset: 4,
      });

      // Should flip to top since bottom would overflow
      expect(position.y).toBeLessThan(bottomEdgeReference.y);
    });

    test("shifts vertically when would overflow top", () => {
      const topEdgeReference: Rect = {
        x: 100,
        y: 50,
        width: 100,
        height: 100,
      };

      const position = getPosition({
        reference: topEdgeReference,
        floating,
        placement: "top",
        offset: 4,
      });

      // Should flip to bottom since top would overflow
      expect(position.y).toBeGreaterThan(topEdgeReference.y);
    });
  });

  describe("edge cases", () => {
    test("handles zero dimensions", () => {
      const position = getPosition({
        reference: { ...reference, width: 0, height: 0 },
        floating: { width: 0, height: 0 },
        placement: "bottom",
      });

      expect(position).toMatchInlineSnapshot(`
        {
          "height": 0,
          "placement": "bottom",
          "width": 0,
          "x": 100,
          "y": 104,
        }
      `);
    });

    test("handles negative coordinates", () => {
      const position = getPosition({
        reference: { ...reference, x: -50, y: -50 },
        floating,
        placement: "bottom",
      });

      // Should be constrained to viewport
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeGreaterThanOrEqual(0);
    });

    test("handles oversize floating element", () => {
      const position = getPosition({
        reference,
        floating: { width: 1025, height: 1000 },
        placement: "bottom",
      });

      // Should be constrained to viewport
      expect(position.x).toBe(-1);
      expect(position.y).toBe(204);
    });
  });

  describe("collision paths", () => {
    test("follows correct collision path for left placement", () => {
      const leftEdgeReference: Rect = {
        x: 50,
        y: 100,
        width: 100,
        height: 100,
      };

      // Try placing on left (should fail), then right (should succeed)
      const position = getPosition({
        reference: leftEdgeReference,
        floating,
        placement: "left",
        offset: 4,
      });

      expect(position.x).toBeGreaterThan(leftEdgeReference.x);
    });

    test("follows correct collision path when all sides overflow", () => {
      const cornerReference: Rect = {
        x: 0,
        y: 0,
        width: 50,
        height: 50,
      };

      const largeFloating: Dimensions = {
        width: 1000,
        height: 1000,
      };

      const position = getPosition({
        reference: cornerReference,
        floating: largeFloating,
        placement: "bottom",
      });

      // Should default to original placement and constrain to viewport
      expect(position.x).toBe(0);
      expect(position.y).toBe(54); // 54 because we shift by the amount of the overflow
    });
  });

  describe("vertical bounds constraints", () => {
    test("constrains to top of viewport when overflowing top", () => {
      // Position where floating element would be placed above viewport
      const position = getPosition({
        reference: {
          x: 100,
          y: -100, // Reference is above viewport
          width: 100,
          height: 100,
        },
        floating,
        placement: "right", // Using right placement so axis="y" for alignment
      });

      // Should be constrained to top of viewport
      expect(position.y).toBe(0);
    });

    test("constrains to bottom of viewport when overflowing bottom", () => {
      // Position where floating element would extend below viewport
      const position = getPosition({
        reference: {
          x: 100,
          y: window.innerHeight - 50, // Reference near bottom of viewport
          width: 100,
          height: 100,
        },
        floating,
        placement: "right", // Using right placement so axis="y" for alignment
      });

      // Should be constrained so bottom edge exactly meets viewport bottom
      expect(position.y + position.height).toBe(window.innerHeight);
      // Verify the adjustment formula: y -= (y + height - viewportHeight)
      expect(position.y).toBe(window.innerHeight - position.height);
    });

    test("maintains position when within bounds", () => {
      // Position where floating element fits within viewport
      const yPosition = 300; // Somewhere in middle of viewport
      const position = getPosition({
        reference: {
          x: 100,
          y: yPosition,
          width: 100,
          height: 100,
        },
        floating,
        placement: "right", // Using right placement so axis="y" for alignment
      });

      // Should maintain original vertical positioning
      expect(position.y).toBe(yPosition - floating.height / 2 + reference.height / 2);
    });
  });
});
