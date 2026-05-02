import { describe, expect, test } from "vitest";
import { getHoveredColumnIndex } from "./get-hovered-column-index.js";

describe("getHoveredColumnIndex", () => {
  test("Should return the correct result given different viewport setups", () => {
    const viewport = document.createElement("div");
    viewport.style.height = "400px";
    viewport.style.width = "400px";

    document.body.appendChild(viewport);

    const xPositions = new Uint32Array([0, 40, 80, 120, 160, 200]);
    let hoveredCol = getHoveredColumnIndex({
      viewport,
      xPositions,
      centerCount: 4,
      clientX: 45,
      endCount: 1,
      startCount: 1,
      rtl: false,
    });

    expect(hoveredCol).toEqual(1);

    hoveredCol = getHoveredColumnIndex({
      viewport,
      xPositions,
      centerCount: 4,
      clientX: 280,
      endCount: 1,
      startCount: 1,
      rtl: true,
    });

    expect(hoveredCol).toEqual(3);

    hoveredCol = getHoveredColumnIndex({
      viewport,
      xPositions,
      centerCount: 4,
      clientX: 20,
      endCount: 1,
      startCount: 1,
      rtl: true,
    });

    expect(hoveredCol).toEqual(5);

    hoveredCol = getHoveredColumnIndex({
      viewport,
      xPositions,
      centerCount: 4,
      clientX: 20,
      startCount: 1,
      endCount: 1,
      rtl: false,
    });

    expect(hoveredCol).toEqual(0);

    hoveredCol = getHoveredColumnIndex({
      viewport,
      xPositions,
      centerCount: 4,
      clientX: 160,
      startCount: 1,
      endCount: 1,
      rtl: false,
    });

    expect(hoveredCol).toEqual(4);

    hoveredCol = getHoveredColumnIndex({
      viewport,
      xPositions,
      centerCount: 4,
      clientX: 170,
      startCount: 1,
      endCount: 1,
      rtl: false,
    });

    expect(hoveredCol).toEqual(null);
    hoveredCol = getHoveredColumnIndex({
      viewport,
      xPositions,
      centerCount: 4,
      clientX: 500,
      startCount: 1,
      endCount: 1,
      rtl: false,
    });

    expect(hoveredCol).toEqual(null);
  });
});
