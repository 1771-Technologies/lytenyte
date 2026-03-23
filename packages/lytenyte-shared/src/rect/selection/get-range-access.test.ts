import { describe, expect, test } from "vitest";
import { getRangeAccess } from "./get-range-access.js";
import type { GridSections } from "../../types.js";
import type { ForceSettings } from "./get-access-forcing.js";

const noForce: ForceSettings = { start: false, end: false, top: false, bottom: false };
const allForce: ForceSettings = { start: true, end: true, top: true, bottom: true };

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

function makeViewport(
  scrollLeft: number,
  scrollTop: number,
  scrollWidth: number,
  clientWidth: number,
  scrollHeight: number,
  clientHeight: number,
): HTMLElement {
  return {
    scrollLeft,
    scrollTop,
    scrollWidth,
    clientWidth,
    scrollHeight,
    clientHeight,
  } as unknown as HTMLElement;
}

// scrollWidth=1000, clientWidth=500 → maxScrollX=500
// scrollHeight=800, clientHeight=400 → maxScrollY=400
const midViewport = makeViewport(100, 100, 1000, 500, 800, 400);

describe("getRangeAccess", () => {
  test("Should return all accessible when all force flags are true", () => {
    const result = getRangeAccess(sections, midViewport, allForce);
    expect(result).toEqual({
      startAccessible: true,
      endAccessible: true,
      topAccessible: true,
      bottomAccessible: true,
    });
  });

  describe("startAccessible", () => {
    test("Should return startAccessible=true when startCount is 0", () => {
      const noStartSections = { ...sections, startCount: 0 };
      const result = getRangeAccess(noStartSections, midViewport, noForce);
      expect(result.startAccessible).toBe(true);
    });

    test("Should return startAccessible=true when scrollLeft is 0", () => {
      const vp = makeViewport(0, 100, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).startAccessible).toBe(true);
    });

    test("Should return startAccessible=true when scrollLeft is exactly 1", () => {
      const vp = makeViewport(1, 100, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).startAccessible).toBe(true);
    });

    test("Should return startAccessible=false when startCount > 0 and scrollLeft > 1 and not forced", () => {
      const vp = makeViewport(2, 100, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).startAccessible).toBe(false);
    });

    test("Should return startAccessible=true when scrollLeft is negative (RTL) and abs value is <= 1", () => {
      const vp = makeViewport(-1, 100, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).startAccessible).toBe(true);
    });
  });

  describe("endAccessible", () => {
    test("Should return endAccessible=true when endCount is 0", () => {
      const noEndSections = { ...sections, endCount: 0 };
      expect(getRangeAccess(noEndSections, midViewport, noForce).endAccessible).toBe(true);
    });

    test("Should return endAccessible=true when scrollLeft equals maxScrollX", () => {
      // maxScrollX = scrollWidth - clientWidth = 1000 - 500 = 500
      const vp = makeViewport(500, 100, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).endAccessible).toBe(true);
    });

    test("Should return endAccessible=true when scrollLeft is maxScrollX - 1", () => {
      const vp = makeViewport(499, 100, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).endAccessible).toBe(true);
    });

    test("Should return endAccessible=false when endCount > 0 and scroll is mid-range and not forced", () => {
      const vp = makeViewport(100, 100, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).endAccessible).toBe(false);
    });
  });

  describe("topAccessible", () => {
    test("Should return topAccessible=true when topCount is 0", () => {
      const noTopSections = { ...sections, topCount: 0 };
      expect(getRangeAccess(noTopSections, midViewport, noForce).topAccessible).toBe(true);
    });

    test("Should return topAccessible=true when scrollTop is 0", () => {
      const vp = makeViewport(100, 0, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).topAccessible).toBe(true);
    });

    test("Should return topAccessible=true when scrollTop is exactly 1", () => {
      const vp = makeViewport(100, 1, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).topAccessible).toBe(true);
    });

    test("Should return topAccessible=false when topCount > 0 and scrollTop > 1 and not forced", () => {
      const vp = makeViewport(100, 2, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).topAccessible).toBe(false);
    });
  });

  describe("bottomAccessible", () => {
    test("Should return bottomAccessible=true when bottomCount is 0", () => {
      const noBottomSections = { ...sections, bottomCount: 0 };
      expect(getRangeAccess(noBottomSections, midViewport, noForce).bottomAccessible).toBe(true);
    });

    test("Should return bottomAccessible=true when scrollTop equals maxScrollY", () => {
      // maxScrollY = scrollHeight - clientHeight = 800 - 400 = 400
      const vp = makeViewport(100, 400, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).bottomAccessible).toBe(true);
    });

    test("Should return bottomAccessible=true when scrollTop is maxScrollY - 1", () => {
      const vp = makeViewport(100, 399, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).bottomAccessible).toBe(true);
    });

    test("Should return bottomAccessible=false when bottomCount > 0 and scroll is mid-range and not forced", () => {
      const vp = makeViewport(100, 100, 1000, 500, 800, 400);
      expect(getRangeAccess(sections, vp, noForce).bottomAccessible).toBe(false);
    });
  });
});
