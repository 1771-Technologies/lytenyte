import { test, expect, describe } from "vitest";
import { rowScrollIntoViewValue } from "../scroll-row-into-view.js";

function createViewport({ scrollTop = 0, clientHeight = 400 }: Partial<HTMLElement> = {}): HTMLElement {
  return {
    scrollTop,
    clientHeight,
  } as HTMLElement;
}

describe("rowScrollIntoViewValue", () => {
  const rowPositions = new Uint32Array([0, 50, 100, 150, 200, 250, 300]);
  const headerHeight = 50;

  test("returns undefined for row in top fixed region", () => {
    const result = rowScrollIntoViewValue({
      topCount: 2,
      bottomCount: 1,
      rowCount: 6,
      rowIndex: 1,
      rowPositions,
      viewport: createViewport(),
      headerHeight,
    });

    expect(result).toBeUndefined();
  });

  test("returns undefined for row in bottom fixed region", () => {
    const result = rowScrollIntoViewValue({
      topCount: 2,
      bottomCount: 2,
      rowCount: 6,
      rowIndex: 5,
      rowPositions,
      viewport: createViewport(),
      headerHeight,
    });

    expect(result).toBeUndefined();
  });

  test("returns undefined when row is fully visible", () => {
    const result = rowScrollIntoViewValue({
      topCount: 1,
      bottomCount: 1,
      rowCount: 6,
      rowIndex: 2,
      rowPositions,
      viewport: createViewport({
        scrollTop: 0,
        clientHeight: 300,
      }),
      headerHeight,
    });

    expect(result).toBeUndefined();
  });

  test("returns scroll offset when row is above the visible region", () => {
    const result = rowScrollIntoViewValue({
      topCount: 1,
      bottomCount: 1,
      rowCount: 6,
      rowIndex: 2,
      rowPositions,
      viewport: createViewport({
        scrollTop: 200,
        clientHeight: 400,
      }),
      headerHeight,
    });

    expect(result).toEqual(50);
  });

  test("returns scroll offset when row is below the visible region", () => {
    const result2 = rowScrollIntoViewValue({
      topCount: 1,
      bottomCount: 1,
      rowCount: 6,
      rowIndex: 4,
      rowPositions,
      viewport: createViewport({
        scrollTop: 0,
        clientHeight: 250,
      }),
      headerHeight,
    });

    expect(result2).toEqual(100);
  });

  test("returns undefined for row in top fixed region (r < topCount)", () => {
    const rowPositions = new Uint32Array([0, 50, 100, 150, 200, 250]);
    const result = rowScrollIntoViewValue({
      topCount: 2,
      bottomCount: 1,
      rowCount: 6,
      rowIndex: 1,
      rowPositions,
      viewport: {
        scrollTop: 0,
        clientHeight: 400,
      } as HTMLElement,
      headerHeight: 50,
    });

    expect(result).toBeUndefined();
  });

  test("returns undefined for row in bottom fixed region (r >= rowCount - bottomCount)", () => {
    const rowPositions = new Uint32Array([0, 50, 100, 150, 200, 250]);
    const result = rowScrollIntoViewValue({
      topCount: 1,
      bottomCount: 2,
      rowCount: 6,
      rowIndex: 5,
      rowPositions,
      viewport: {
        scrollTop: 0,
        clientHeight: 400,
      } as HTMLElement,
      headerHeight: 50,
    });

    expect(result).toBeUndefined();
  });
});
