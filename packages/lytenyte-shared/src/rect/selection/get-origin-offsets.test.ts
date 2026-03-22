import { describe, expect, test } from "vitest";
import { getOriginOffsets } from "./get-origin-offsets.js";
import type { GridSections } from "../../types.js";

const sections: GridSections = {
  rowCount: 20,
  topCount: 1,
  centerCount: 18,
  bottomCount: 1,
  startCount: 1,
  endCount: 1,
  colCenterCount: 18,
  topCutoff: 2,
  bottomCutoff: 18,
  startCutoff: 2,
  endCutoff: 18,
  topOffset: 50,
  bottomOffset: 50,
  startOffset: 80,
  endOffset: 80,
};

// Viewport: 600 wide × 400 tall
const vpW = 600;
const vpH = 400;

describe("getOriginOffsets", () => {
  describe("originTop", () => {
    test("Should return originTop=true when mouse Y is strictly above the top offset", () => {
      const result = getOriginOffsets(sections, 49, 200, false, vpH, vpW);
      expect(result.originTop).toBe(true);
    });

    test("Should return originTop=false when mouse Y equals the top offset", () => {
      const result = getOriginOffsets(sections, 50, 200, false, vpH, vpW);
      expect(result.originTop).toBe(false);
    });

    test("Should return originTop=false when mouse Y is below the top offset", () => {
      const result = getOriginOffsets(sections, 200, 200, false, vpH, vpW);
      expect(result.originTop).toBe(false);
    });
  });

  describe("originBottom", () => {
    test("Should return originBottom=true when mouse Y is strictly below vpH minus bottomOffset", () => {
      // vpH=400, bottomOffset=50 → threshold=350; mouse at 351
      const result = getOriginOffsets(sections, 351, 200, false, vpH, vpW);
      expect(result.originBottom).toBe(true);
    });

    test("Should return originBottom=false when mouse Y equals the bottom threshold", () => {
      const result = getOriginOffsets(sections, 350, 200, false, vpH, vpW);
      expect(result.originBottom).toBe(false);
    });

    test("Should return originBottom=false when mouse Y is above the bottom threshold", () => {
      const result = getOriginOffsets(sections, 200, 200, false, vpH, vpW);
      expect(result.originBottom).toBe(false);
    });
  });

  describe("originStart — LTR", () => {
    test("Should return originStart=true in LTR when mouse X is strictly left of startOffset", () => {
      const result = getOriginOffsets(sections, 200, 79, false, vpH, vpW);
      expect(result.originStart).toBe(true);
    });

    test("Should return originStart=false in LTR when mouse X equals startOffset", () => {
      const result = getOriginOffsets(sections, 200, 80, false, vpH, vpW);
      expect(result.originStart).toBe(false);
    });

    test("Should return originStart=false in LTR when mouse X is past startOffset", () => {
      const result = getOriginOffsets(sections, 200, 200, false, vpH, vpW);
      expect(result.originStart).toBe(false);
    });
  });

  describe("originEnd — LTR", () => {
    test("Should return originEnd=true in LTR when mouse X is strictly right of vpW minus endOffset", () => {
      // vpW=600, endOffset=80 → threshold=520; mouse at 521
      const result = getOriginOffsets(sections, 200, 521, false, vpH, vpW);
      expect(result.originEnd).toBe(true);
    });

    test("Should return originEnd=false in LTR when mouse X equals the end threshold", () => {
      const result = getOriginOffsets(sections, 200, 520, false, vpH, vpW);
      expect(result.originEnd).toBe(false);
    });

    test("Should return originEnd=false in LTR when mouse X is left of the end threshold", () => {
      const result = getOriginOffsets(sections, 200, 200, false, vpH, vpW);
      expect(result.originEnd).toBe(false);
    });
  });

  describe("originStart — RTL", () => {
    test("Should return originStart=true in RTL when mouse X is strictly right of vpW minus startOffset", () => {
      // vpW=600, startOffset=80 → threshold=520; mouse at 521 → in start (right side in RTL)
      const result = getOriginOffsets(sections, 200, 521, true, vpH, vpW);
      expect(result.originStart).toBe(true);
    });

    test("Should return originStart=false in RTL when mouse X equals the threshold", () => {
      const result = getOriginOffsets(sections, 200, 520, true, vpH, vpW);
      expect(result.originStart).toBe(false);
    });

    test("Should return originStart=false in RTL when mouse X is left of the threshold", () => {
      const result = getOriginOffsets(sections, 200, 200, true, vpH, vpW);
      expect(result.originStart).toBe(false);
    });
  });

  describe("originEnd — RTL", () => {
    test("Should return originEnd=true in RTL when mouse X is strictly left of endOffset", () => {
      // endOffset=80; mouse at 79 → in end section (left side in RTL)
      const result = getOriginOffsets(sections, 200, 79, true, vpH, vpW);
      expect(result.originEnd).toBe(true);
    });

    test("Should return originEnd=false in RTL when mouse X equals endOffset", () => {
      const result = getOriginOffsets(sections, 200, 80, true, vpH, vpW);
      expect(result.originEnd).toBe(false);
    });

    test("Should return originEnd=false in RTL when mouse X is past endOffset", () => {
      const result = getOriginOffsets(sections, 200, 200, true, vpH, vpW);
      expect(result.originEnd).toBe(false);
    });
  });

  describe("center origin", () => {
    test("Should return all false when mouse is in the center of the viewport in LTR", () => {
      const result = getOriginOffsets(sections, 200, 300, false, vpH, vpW);
      expect(result).toEqual({
        originTop: false,
        originBottom: false,
        originStart: false,
        originEnd: false,
      });
    });

    test("Should return all false when mouse is in the center of the viewport in RTL", () => {
      const result = getOriginOffsets(sections, 200, 300, true, vpH, vpW);
      expect(result).toEqual({
        originTop: false,
        originBottom: false,
        originStart: false,
        originEnd: false,
      });
    });
  });
});
