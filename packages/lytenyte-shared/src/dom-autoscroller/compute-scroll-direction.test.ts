import { describe, expect, test } from "vitest";
import { computeScrollDirection } from "./compute-scroll-direction.js";

function dir(
  x: number,
  y: number,
  {
    w = 600,
    h = 400,
    topOffset = 0,
    bottomOffset = 0,
    startOffset = 0,
    endOffset = 0,
    rtl = false,
    originTop = false,
    originBottom = false,
    originInStart = false,
    originInEnd = false,
  }: {
    w?: number;
    h?: number;
    topOffset?: number;
    bottomOffset?: number;
    startOffset?: number;
    endOffset?: number;
    rtl?: boolean;
    originTop?: boolean;
    originBottom?: boolean;
    originInStart?: boolean;
    originInEnd?: boolean;
  } = {},
) {
  return computeScrollDirection(
    x,
    y,
    w,
    h,
    topOffset,
    bottomOffset,
    startOffset,
    endOffset,
    rtl,
    originTop,
    originBottom,
    originInStart,
    originInEnd,
  );
}

describe("computeScrollDirection", () => {
  test("Should return dirY=-1 when mouse is strictly above the top trigger zone", () => {
    expect(dir(300, 49).dirY).toBe(-1);
  });

  test("Should return dirY=0 when mouse is exactly at the top trigger boundary", () => {
    expect(dir(300, 50).dirY).toBe(0);
  });

  test("Should return dirY=0 when mouse is in the center", () => {
    expect(dir(300, 200).dirY).toBe(0);
  });

  test("Should return dirY=1 when mouse is strictly below the bottom trigger zone", () => {
    expect(dir(300, 351).dirY).toBe(1);
  });

  test("Should return dirY=0 when mouse is exactly at the bottom trigger boundary", () => {
    expect(dir(300, 350).dirY).toBe(0);
  });

  test("Should account for topOffset when computing the top trigger", () => {
    expect(dir(300, 69, { topOffset: 20 }).dirY).toBe(-1);
    expect(dir(300, 70, { topOffset: 20 }).dirY).toBe(0);
  });

  test("Should account for bottomOffset when computing the bottom trigger", () => {
    expect(dir(300, 331, { bottomOffset: 20 }).dirY).toBe(1);
    expect(dir(300, 330, { bottomOffset: 20 }).dirY).toBe(0);
  });

  test("Should return dirY=1 when mouse is past the bottom trigger", () => {
    expect(dir(300, 351, { originTop: true }).dirY).toBe(1);
  });

  test("Should return dirY=0 when mouse is at the bottom trigger boundary", () => {
    expect(dir(300, 350, { originTop: true }).dirY).toBe(0);
  });

  test("Should return dirY=0 even when mouse is above the top trigger (origin side suppressed)", () => {
    expect(dir(300, 49, { originTop: true }).dirY).toBe(0);
  });

  test("Should return dirY=-1 when mouse is above the top trigger", () => {
    expect(dir(300, 49, { originBottom: true }).dirY).toBe(-1);
  });

  test("Should return dirY=0 when mouse is at the top trigger boundary", () => {
    expect(dir(300, 50, { originBottom: true }).dirY).toBe(0);
  });

  test("Should return dirY=0 even when mouse is past the bottom trigger (origin side suppressed)", () => {
    expect(dir(300, 351, { originBottom: true }).dirY).toBe(0);
  });

  test("Should return dirX=-1 when mouse is strictly left of the start trigger zone in LTR", () => {
    expect(dir(49, 200).dirX).toBe(-1);
  });

  test("Should return dirX=0 when mouse is exactly at the start trigger boundary in LTR", () => {
    expect(dir(50, 200).dirX).toBe(0);
  });

  test("Should return dirX=0 when mouse is in the center in LTR", () => {
    expect(dir(300, 200).dirX).toBe(0);
  });

  test("Should return dirX=1 when mouse is strictly right of the end trigger zone in LTR", () => {
    expect(dir(551, 200).dirX).toBe(1);
  });

  test("Should return dirX=0 when mouse is exactly at the end trigger boundary in LTR", () => {
    expect(dir(550, 200).dirX).toBe(0);
  });

  test("Should account for startOffset in LTR", () => {
    expect(dir(69, 200, { startOffset: 20 }).dirX).toBe(-1);
    expect(dir(70, 200, { startOffset: 20 }).dirX).toBe(0);
  });

  test("Should account for endOffset in LTR", () => {
    expect(dir(531, 200, { endOffset: 20 }).dirX).toBe(1);
    expect(dir(530, 200, { endOffset: 20 }).dirX).toBe(0);
  });

  test("Should return dirX=1 when mouse is strictly right of the start trigger zone in RTL", () => {
    expect(dir(551, 200, { rtl: true }).dirX).toBe(1);
  });

  test("Should return dirX=0 when mouse is exactly at the start trigger boundary in RTL", () => {
    expect(dir(550, 200, { rtl: true }).dirX).toBe(0);
  });

  test("Should return dirX=-1 when mouse is strictly left of the end trigger zone in RTL", () => {
    expect(dir(49, 200, { rtl: true }).dirX).toBe(-1);
  });

  test("Should return dirX=0 when mouse is exactly at the end trigger boundary in RTL", () => {
    expect(dir(50, 200, { rtl: true }).dirX).toBe(0);
  });

  test("Should return dirX=0 when mouse is in the center in RTL", () => {
    expect(dir(300, 200, { rtl: true }).dirX).toBe(0);
  });

  test("Should return dirX=1 when mouse is past the end trigger in LTR", () => {
    expect(dir(551, 200, { originInStart: true }).dirX).toBe(1);
  });

  test("Should return dirX=0 when mouse is near the start boundary (origin side suppressed) in LTR", () => {
    expect(dir(49, 200, { originInStart: true }).dirX).toBe(0);
  });

  test("Should return dirX=-1 when mouse is past the start trigger in LTR", () => {
    expect(dir(49, 200, { originInEnd: true }).dirX).toBe(-1);
  });

  test("Should return dirX=0 when mouse is near the end boundary (origin side suppressed) in LTR", () => {
    expect(dir(551, 200, { originInEnd: true }).dirX).toBe(0);
  });

  test("Should return dirX=-1 when mouse is past the end trigger (left side) in RTL", () => {
    expect(dir(49, 200, { rtl: true, originInStart: true }).dirX).toBe(-1);
  });

  test("Should return dirX=0 when mouse is near the start boundary (right side, suppressed) in RTL", () => {
    expect(dir(551, 200, { rtl: true, originInStart: true }).dirX).toBe(0);
  });

  test("Should return dirX=1 when mouse is past the start trigger (right side) in RTL", () => {
    expect(dir(551, 200, { rtl: true, originInEnd: true }).dirX).toBe(1);
  });

  test("Should return dirX=0 when mouse is near the end boundary (left side, suppressed) in RTL", () => {
    expect(dir(49, 200, { rtl: true, originInEnd: true }).dirX).toBe(0);
  });
  test("Should return dirX=-1 and dirY=-1 when mouse is in the top-left corner in LTR", () => {
    expect(dir(0, 0)).toEqual({ dirX: -1, dirY: -1 });
  });

  test("Should return dirX=1 and dirY=1 when mouse is in the bottom-right corner in LTR", () => {
    expect(dir(600, 400)).toEqual({ dirX: 1, dirY: 1 });
  });

  test("Should return dirX=0 and dirY=0 when mouse is exactly in the center", () => {
    expect(dir(300, 200)).toEqual({ dirX: 0, dirY: 0 });
  });

  test("Should return dirX=1 and dirY=-1 when mouse is in the top-right corner in LTR", () => {
    expect(dir(600, 0)).toEqual({ dirX: 1, dirY: -1 });
  });
});
