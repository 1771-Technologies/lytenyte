import { describe, expect, test } from "vitest";
import { rowPositions } from "./row-positions.js";

describe("rowPositions", () => {
  test("Should compute cumulative positions for a fixed row height", () => {
    expect(rowPositions(5, 20, 0, {}, () => 0, 0)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      40,
      60,
      80,
      100,
    ]
  `);
  });

  test("Should add detail height to each row when using a fixed row height", () => {
    expect(rowPositions(5, 20, 0, {}, (i) => (i % 2 ? 30 : 0), 0)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      70,
      90,
      140,
      160,
    ]
  `);
  });

  test("Should clamp row positions to zero when the fixed row height is negative", () => {
    expect(rowPositions(5, -20, 0, {}, () => 0, 0)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      0,
      0,
      0,
      0,
      0,
    ]
  `);
  });

  test("Should return a single zero position when row count is zero or negative for fixed and auto modes", () => {
    expect(rowPositions(0, 20, 0, {}, () => 0, 0)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
      ]
    `);
    expect(rowPositions(-3, 20, 0, {}, () => 0, 0)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
      ]
    `);
    expect(rowPositions(0, "auto", 20, {}, () => 0, 0)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
      ]
    `);
    expect(rowPositions(-3, "auto", 20, {}, () => 0, 0)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
      ]
    `);
  });

  test("Should compute cumulative positions using a function-based row height", () => {
    expect(
      rowPositions(
        5,
        (i) => (i % 2 ? 10 : 20),
        0,
        {},
        () => 0,
        0,
      ),
    ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      30,
      50,
      60,
      80,
    ]
  `);
  });

  test("Should add detail height to each row when using a function-based row height", () => {
    expect(
      rowPositions(
        5,
        (i) => (i % 2 ? 10 : 20),
        0,
        {},
        (i) => (i % 2 ? 10 : 0),
        0,
      ),
    ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      40,
      60,
      80,
      100,
    ]
  `);
  });

  test("Should clamp rows to zero when the function-based row height returns a negative value", () => {
    expect(
      rowPositions(
        5,
        (i) => (i % 2 ? -10 : 20),
        0,
        {},
        () => 0,
        0,
      ),
    ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      20,
      40,
      40,
      60,
    ]
  `);
  });

  test("Should return a single zero position when row count is negative for function-based row height", () => {
    expect(
      rowPositions(
        -5,
        (i) => (i % 2 ? -10 : 20),
        0,
        {},
        () => 0,
        0,
      ),
    ).toMatchInlineSnapshot(`
    Uint32Array [
      0,
    ]
  `);
  });

  test("Should clamp the combined row and detail height to zero rather than clamping each value separately", () => {
    expect(
      rowPositions(
        3,
        (i) => (i % 2 ? -10 : 20),
        0,
        {},
        (i) => (i % 2 ? 25 : 0),
        0,
      ),
    ).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        20,
        35,
        55,
      ]
    `);
  });

  test("Should use the auto height guess for all rows when the cache is empty", () => {
    expect(rowPositions(4, "auto", 25, {}, () => 0, 0)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        25,
        50,
        75,
        100,
      ]
    `);
  });

  test("Should use cached height for rows with a cache entry and the guess for uncached rows", () => {
    expect(rowPositions(5, "auto", 20, { 2: 50 }, () => 0, 0)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      40,
      90,
      110,
      130,
    ]
  `);
  });

  test("Should use each cache entry independently and fall back to the guess for uncached rows", () => {
    expect(rowPositions(5, "auto", 20, { 0: 10, 2: 50, 4: 30 }, () => 0, 0)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        10,
        30,
        80,
        100,
        130,
      ]
    `);
  });

  test("Should add detail height to each row when using auto row height", () => {
    expect(rowPositions(5, "auto", 20, { 2: 50 }, () => 10, 0)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      30,
      60,
      120,
      150,
      180,
    ]
  `);
  });

  test("Should clamp rows to zero when the auto height guess is negative and no cache entry exists", () => {
    expect(rowPositions(5, "auto", -20, { 2: 50 }, () => 10, 0)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      0,
      0,
      60,
      60,
      60,
    ]
  `);
  });

  test("Should fall back to fixed height when fill rows overflow the container", () => {
    expect(rowPositions(5, "fill:20", 0, {}, () => 0, 80)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      20,
      40,
      60,
      80,
      100,
    ]
  `);
  });

  test("Should fall back to fixed height when fill rows exactly fill the container", () => {
    expect(rowPositions(5, "fill:20", 0, {}, () => 0, 100)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        20,
        40,
        60,
        80,
        100,
      ]
    `);
  });

  test("Should return a single zero position for fill mode when row count is zero", () => {
    expect(rowPositions(0, "fill:20", 0, {}, () => 0, 500)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
      ]
    `);
  });

  test("Should distribute free space evenly among rows when fill rows underflow the container", () => {
    expect(rowPositions(5, "fill:20", 0, {}, () => 0, 200)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      40,
      80,
      120,
      160,
      200,
    ]
  `);

    expect(rowPositions(5, "fill:20", 0, {}, () => 0, 211)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      42,
      84,
      126,
      168,
      210,
    ]
  `);

    expect(rowPositions(5, "fill:21", 0, {}, () => 0, 177)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      36,
      71,
      106,
      141,
      176,
    ]
  `);
  });

  test("Should not distribute bonus pixels when fill free space leaves a remainder of exactly one", () => {
    // freeSpace = 201 - 100 = 101, flexTotal = 5, 101 % 5 = 1
    // remainder = 101 - 100 - 1 = 0, so no row receives a bonus pixel
    // final total = 200 = containerHeight - 1
    expect(rowPositions(5, "fill:20", 0, {}, () => 0, 201)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        40,
        80,
        120,
        160,
        200,
      ]
    `);
  });

  test("Should add detail height to each row when using fill mode", () => {
    expect(rowPositions(5, "fill:20", 0, {}, () => 10, 200)).toMatchInlineSnapshot(`
      Uint32Array [
        0,
        50,
        100,
        150,
        200,
        250,
      ]
    `);
  });
});
