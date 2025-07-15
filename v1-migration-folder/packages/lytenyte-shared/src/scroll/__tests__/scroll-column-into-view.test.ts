import { describe, test, expect } from "vitest";
import { columnScrollIntoViewValue } from "../scroll-column-into-view";

function createViewport({
  scrollLeft = 0,
  clientWidth = 300,
}: Partial<HTMLElement> = {}): HTMLElement {
  return {
    scrollLeft,
    clientWidth,
  } as HTMLElement;
}

describe("columnScrollIntoViewValue", () => {
  const columnPositions = new Uint32Array([0, 100, 200, 300, 400, 500, 600]); // 6 columns, each 100px wide

  test("returns undefined if column index is outside the center range (before)", () => {
    const result = columnScrollIntoViewValue({
      startCount: 1,
      centerCount: 3,
      endCount: 2,
      columnIndex: 0,
      columnPositions,
      viewport: createViewport(),
    });

    expect(result).toBeUndefined();
  });

  test("returns undefined if column index is outside the center range (after)", () => {
    const result = columnScrollIntoViewValue({
      startCount: 1,
      centerCount: 3,
      endCount: 2,
      columnIndex: 4,
      columnPositions,
      viewport: createViewport(),
    });

    expect(result).toBeUndefined();
  });

  test("returns undefined if column is already fully visible", () => {
    const result = columnScrollIntoViewValue({
      startCount: 1,
      centerCount: 3,
      endCount: 2,
      columnIndex: 2,
      columnPositions: new Uint32Array([0, 100, 200, 300, 400, 500, 600]),
      viewport: {
        scrollLeft: 0,
        clientWidth: 500,
      } as HTMLElement,
    });

    expect(result).toEqual(0);
  });

  test("scrolls back if column is partially out to the left", () => {
    const result = columnScrollIntoViewValue({
      startCount: 1,
      centerCount: 3,
      endCount: 2,
      columnIndex: 2,
      columnPositions,
      viewport: createViewport({
        scrollLeft: 250,
        clientWidth: 300,
      }),
    });

    // position = 200, colWidth = 100 → should scroll to 100
    expect(result).toEqual(100);
  });

  test("scrolls forward if column is entirely off to the left", () => {
    const result = columnScrollIntoViewValue({
      startCount: 1,
      centerCount: 3,
      endCount: 2,
      columnIndex: 1,
      columnPositions,
      viewport: createViewport({
        scrollLeft: 300,
        clientWidth: 300,
      }),
    });

    // position = 100, startWidth = 100 → should scroll to 0
    expect(result).toEqual(0);
  });

  test("scrolls forward if column is out of view to the right", () => {
    const result = columnScrollIntoViewValue({
      startCount: 1,
      centerCount: 3,
      endCount: 2,
      columnIndex: 3,
      columnPositions,
      viewport: createViewport({
        scrollLeft: 0,
        clientWidth: 250,
      }),
    });

    // position = 300, colWidth = 100, clientWidth = 250
    // expected scroll = position - (viewport.clientWidth - endWidth) + colWidth
    expect(result).toBeGreaterThan(0);
  });

  test("returns scroll offset when column partially overlaps start of viewport", () => {
    const customColumnPositions = new Uint32Array([0, 100, 200, 320, 400, 500, 600]);
    // columnIndex = 2 → position = 200, width = 120

    const result = columnScrollIntoViewValue({
      startCount: 1,
      centerCount: 3,
      endCount: 2,
      columnIndex: 2,
      columnPositions: customColumnPositions,
      viewport: {
        scrollLeft: 200,
        clientWidth: 400,
      } as HTMLElement,
    });

    // position = 200, colWidth = 120
    // Expected: position - colWidth = 200 - 120 = 80
    expect(result).toEqual(80);
  });

  test("returns undefined if column's right edge is within the visible scroll range", () => {
    const customColumnPositions = new Uint32Array([0, 200, 800]);

    const result = columnScrollIntoViewValue({
      startCount: 0,
      centerCount: 3,
      endCount: 0,
      columnIndex: 1,
      columnPositions: customColumnPositions,
      viewport: {
        scrollLeft: 350,
        clientWidth: 400,
      } as HTMLElement,
    });

    expect(result).toEqual(-400);
  });

  test("return undefined if the column is full in view", () => {
    const customColumnPositions = new Uint32Array([0, 200, 400, 600, 800]);

    const result = columnScrollIntoViewValue({
      startCount: 0,
      centerCount: 5,
      endCount: 0,
      columnIndex: 1,
      columnPositions: customColumnPositions,
      viewport: {
        scrollLeft: 0,
        clientWidth: 600,
      } as HTMLElement,
    });

    expect(result).toEqual(undefined);
  });
});
