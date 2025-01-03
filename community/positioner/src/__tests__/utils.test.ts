import {
  getSide,
  getAlignment,
  getAxis,
  getAlignmentAxis,
  getOppositeAxis,
  getAxisLength,
  getOppositePlacement,
} from "../utils.js";
import type { Placement, Side, Axis } from "../types.js";

describe("placement utilities", () => {
  describe("getSide", () => {
    test("extracts side from simple placement", () => {
      expect(getSide("top")).toBe("top");
      expect(getSide("right")).toBe("right");
      expect(getSide("bottom")).toBe("bottom");
      expect(getSide("left")).toBe("left");
    });

    test("extracts side from placement with alignment", () => {
      expect(getSide("top-start")).toBe("top");
      expect(getSide("right-end")).toBe("right");
      expect(getSide("bottom-start")).toBe("bottom");
      expect(getSide("left-end")).toBe("left");
    });
  });

  describe("getAlignment", () => {
    test("returns undefined for simple placement", () => {
      expect(getAlignment("top")).toBeUndefined();
      expect(getAlignment("right")).toBeUndefined();
      expect(getAlignment("bottom")).toBeUndefined();
      expect(getAlignment("left")).toBeUndefined();
    });

    test("extracts alignment from placement with alignment", () => {
      expect(getAlignment("top-start")).toBe("start");
      expect(getAlignment("right-end")).toBe("end");
      expect(getAlignment("bottom-start")).toBe("start");
      expect(getAlignment("left-end")).toBe("end");
    });
  });

  describe("getAxis", () => {
    test("returns x for horizontal sides", () => {
      expect(getAxis("left")).toBe("x");
      expect(getAxis("right")).toBe("x");
    });

    test("returns y for vertical sides", () => {
      expect(getAxis("top")).toBe("y");
      expect(getAxis("bottom")).toBe("y");
    });
  });

  describe("getAlignmentAxis", () => {
    test("returns opposite axis of side axis", () => {
      // For horizontal sides (left/right), alignment axis should be y
      expect(getAlignmentAxis("left")).toBe("y");
      expect(getAlignmentAxis("right")).toBe("y");

      // For vertical sides (top/bottom), alignment axis should be x
      expect(getAlignmentAxis("top")).toBe("x");
      expect(getAlignmentAxis("bottom")).toBe("x");
    });
  });

  describe("getOppositeAxis", () => {
    test("returns opposite axis", () => {
      expect(getOppositeAxis("x")).toBe("y");
      expect(getOppositeAxis("y")).toBe("x");
    });

    test("is symmetric", () => {
      const axes: Axis[] = ["x", "y"];
      for (const axis of axes) {
        expect(getOppositeAxis(getOppositeAxis(axis))).toBe(axis);
      }
    });
  });

  describe("getAxisLength", () => {
    test("returns width for x axis", () => {
      expect(getAxisLength("x")).toBe("width");
    });

    test("returns height for y axis", () => {
      expect(getAxisLength("y")).toBe("height");
    });
  });

  describe("getOppositePlacement", () => {
    test("returns opposite side", () => {
      expect(getOppositePlacement("top")).toBe("bottom");
      expect(getOppositePlacement("right")).toBe("left");
      expect(getOppositePlacement("bottom")).toBe("top");
      expect(getOppositePlacement("left")).toBe("right");
    });

    test("is symmetric", () => {
      const sides: Side[] = ["top", "right", "bottom", "left"];
      for (const side of sides) {
        expect(getOppositePlacement(getOppositePlacement(side))).toBe(side);
      }
    });
  });

  describe("combined utilities", () => {
    test("getAxis and getOppositeAxis are complementary", () => {
      const sides: Side[] = ["top", "right", "bottom", "left"];
      for (const side of sides) {
        const axis = getAxis(side);
        const alignmentAxis = getAlignmentAxis(side);
        expect(getOppositeAxis(axis)).toBe(alignmentAxis);
      }
    });

    test("getSide and getAlignment work together", () => {
      const placements: Placement[] = [
        "top-start",
        "top-end",
        "right-start",
        "right-end",
        "bottom-start",
        "bottom-end",
        "left-start",
        "left-end",
      ];

      for (const placement of placements) {
        const [expectedSide, expectedAlignment] = placement.split("-");
        expect(getSide(placement)).toBe(expectedSide);
        expect(getAlignment(placement)).toBe(expectedAlignment);
      }
    });

    test("getOppositePlacement and getAxis preserve axis", () => {
      const sides: Side[] = ["top", "right", "bottom", "left"];
      for (const side of sides) {
        const originalAxis = getAxis(side);
        const oppositeAxis = getAxis(getOppositePlacement(side));
        expect(originalAxis).toBe(oppositeAxis);
      }
    });
  });

  describe("edge cases", () => {
    test("getSide handles invalid placement formats", () => {
      // @ts-expect-error - Testing invalid input
      expect(getSide("invalid")).toBe("invalid");
      // @ts-expect-error - Testing invalid input
      expect(getSide("top-invalid")).toBe("top");
      // @ts-expect-error - Testing invalid input
      expect(getSide("invalid-start")).toBe("invalid");
    });

    test("getAlignment handles invalid placement formats", () => {
      // @ts-expect-error - Testing invalid input
      expect(getAlignment("invalid")).toBeUndefined();
      // @ts-expect-error - Testing invalid input
      expect(getAlignment("top-invalid")).toBe("invalid");
      // @ts-expect-error - Testing invalid input
      expect(getAlignment("invalid-start")).toBe("start");
    });

    test("getAxis handles invalid sides", () => {
      // @ts-expect-error - Testing invalid input
      expect(getAxis("invalid")).toBe("y");
    });
  });
});
