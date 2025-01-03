import { describe, test, expect } from "vitest";
import { getCoordsFromPlacement } from "../get-coords-from-placement";
import type { Rect, Dimensions } from "../types";

describe("getCoordsFromPlacement", () => {
  const reference: Rect = {
    x: 100,
    y: 100,
    width: 100,
    height: 100,
  };

  const floating: Dimensions = {
    width: 50,
    height: 50,
  };

  describe("basic placements without alignment", () => {
    test("places on top", () => {
      const coords = getCoordsFromPlacement(reference, floating, "top", undefined, false);
      expect(coords).toEqual({
        x: 125, // reference.x + (reference.width / 2) - (floating.width / 2)
        y: 50, // reference.y - floating.height
      });
    });

    test("places on bottom", () => {
      const coords = getCoordsFromPlacement(reference, floating, "bottom", undefined, false);
      expect(coords).toEqual({
        x: 125, // reference.x + (reference.width / 2) - (floating.width / 2)
        y: 200, // reference.y + reference.height
      });
    });

    test("places on right", () => {
      const coords = getCoordsFromPlacement(reference, floating, "right", undefined, false);
      expect(coords).toEqual({
        x: 200, // reference.x + reference.width
        y: 125, // reference.y + (reference.height / 2) - (floating.height / 2)
      });
    });

    test("places on left", () => {
      const coords = getCoordsFromPlacement(reference, floating, "left", undefined, false);
      expect(coords).toEqual({
        x: 50, // reference.x - floating.width
        y: 125, // reference.y + (reference.height / 2) - (floating.height / 2)
      });
    });
  });

  describe("start alignment", () => {
    test("aligns top-start", () => {
      const coords = getCoordsFromPlacement(reference, floating, "top", "start", false);
      expect(coords).toEqual({
        x: 100, // reference.x
        y: 50, // reference.y - floating.height
      });
    });

    test("aligns bottom-start", () => {
      const coords = getCoordsFromPlacement(reference, floating, "bottom", "start", false);
      expect(coords).toEqual({
        x: 100, // reference.x
        y: 200, // reference.y + reference.height
      });
    });

    test("aligns right-start", () => {
      const coords = getCoordsFromPlacement(reference, floating, "right", "start", false);
      expect(coords).toEqual({
        x: 200, // reference.x + reference.width
        y: 100, // reference.y
      });
    });

    test("aligns left-start", () => {
      const coords = getCoordsFromPlacement(reference, floating, "left", "start", false);
      expect(coords).toEqual({
        x: 50, // reference.x - floating.width
        y: 100, // reference.y
      });
    });
  });

  describe("end alignment", () => {
    test("aligns top-end", () => {
      const coords = getCoordsFromPlacement(reference, floating, "top", "end", false);
      expect(coords).toEqual({
        x: 150, // reference.x + reference.width - floating.width
        y: 50, // reference.y - floating.height
      });
    });

    test("aligns bottom-end", () => {
      const coords = getCoordsFromPlacement(reference, floating, "bottom", "end", false);
      expect(coords).toEqual({
        x: 150, // reference.x + reference.width - floating.width
        y: 200, // reference.y + reference.height
      });
    });

    test("aligns right-end", () => {
      const coords = getCoordsFromPlacement(reference, floating, "right", "end", false);
      expect(coords).toEqual({
        x: 200, // reference.x + reference.width
        y: 150, // reference.y + reference.height - floating.height
      });
    });

    test("aligns left-end", () => {
      const coords = getCoordsFromPlacement(reference, floating, "left", "end", false);
      expect(coords).toEqual({
        x: 50, // reference.x - floating.width
        y: 150, // reference.y + reference.height - floating.height
      });
    });
  });

  describe("RTL support", () => {
    test("handles RTL for vertical alignments", () => {
      const coordsStart = getCoordsFromPlacement(reference, floating, "top", "start", true);
      const coordsEnd = getCoordsFromPlacement(reference, floating, "top", "end", true);

      // RTL should not affect vertical alignments
      expect(coordsStart).toEqual({
        x: 150, // reference.x
        y: 50, // reference.y - floating.height
      });
      expect(coordsEnd).toEqual({
        x: 100, // reference.x + reference.width - floating.width
        y: 50, // reference.y - floating.height
      });
    });

    test("handles RTL for horizontal alignments", () => {
      const coordsStart = getCoordsFromPlacement(reference, floating, "right", "start", true);
      const coordsEnd = getCoordsFromPlacement(reference, floating, "right", "end", true);

      // RTL should invert the alignment for horizontal placements
      expect(coordsStart).toEqual({
        x: 200, // reference.x + reference.width
        y: 100, // reference.y
      });
      expect(coordsEnd).toEqual({
        x: 200, // reference.x + reference.width
        y: 150, // reference.y + reference.height - floating.height
      });
    });
  });

  describe("edge cases", () => {
    test("handles invalid side gracefully", () => {
      // @ts-expect-error - Testing invalid input
      const coords = getCoordsFromPlacement(reference, floating, "invalid", undefined, false);
      expect(coords).toEqual({
        x: reference.x,
        y: reference.y,
      });
    });

    test("handles undefined alignment gracefully", () => {
      const coords = getCoordsFromPlacement(reference, floating, "top", undefined, false);
      expect(coords).toEqual({
        x: 125, // Centered
        y: 50,
      });
    });

    test("handles zero dimensions", () => {
      const zeroRef: Rect = { x: 0, y: 0, width: 0, height: 0 };
      const zeroFloat: Dimensions = { width: 0, height: 0 };

      const coords = getCoordsFromPlacement(zeroRef, zeroFloat, "top", undefined, false);
      expect(coords).toEqual({
        x: 0,
        y: 0,
      });
    });

    test("handles negative coordinates", () => {
      const negativeRef: Rect = { x: -100, y: -100, width: 100, height: 100 };

      const coords = getCoordsFromPlacement(negativeRef, floating, "top", undefined, false);
      expect(coords).toEqual({
        x: -75, // -100 + (100/2) - (50/2)
        y: -150, // -100 - 50
      });
    });
  });
});
