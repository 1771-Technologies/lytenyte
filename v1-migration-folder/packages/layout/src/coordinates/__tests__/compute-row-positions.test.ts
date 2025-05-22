import { expect, test } from "vitest";
import { computeRowPositions } from "../compute-row-positions.js";

test("computeRowPositions: should handle fixed row heights", () => {
  expect(computeRowPositions(5, 20, 0, {}, () => 0, 0)).toMatchInlineSnapshot(`
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

test("computeRowPositions: should handle fixed row heights with detail rows", () => {
  expect(computeRowPositions(5, 20, 0, {}, (i) => (i % 2 ? 30 : 0), 0)).toMatchInlineSnapshot(`
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

test("computeRowPositions: should handle negative fixed row heights", () => {
  expect(computeRowPositions(5, -20, 0, {}, () => 0, 0)).toMatchInlineSnapshot(`
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

test("computeRowPositions: should handle variable row heights", () => {
  expect(
    computeRowPositions(
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

test("computeRowPositions: should handle variable row heights with detail rows", () => {
  expect(
    computeRowPositions(
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

test("computeRowPositions: should handle variable row heights with negative values", () => {
  expect(
    computeRowPositions(
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

test("computeRowPositions: should handle negative row counts with variable row height", () => {
  expect(
    computeRowPositions(
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

test("computeRowPositions: should handle auto row heights", () => {
  expect(computeRowPositions(5, "auto", 20, { 2: 50 }, () => 0, 0)).toMatchInlineSnapshot(`
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

test("computeRowPositions: should handle auto row heights with row detail", () => {
  expect(computeRowPositions(5, "auto", 20, { 2: 50 }, () => 10, 0)).toMatchInlineSnapshot(`
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

test("computeRowPositions: should handle auto row heights with negative row heights", () => {
  expect(computeRowPositions(5, "auto", -20, { 2: 50 }, () => 10, 0)).toMatchInlineSnapshot(`
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

test("computeRowPositions: should handle fill when there isn't enough space", () => {
  expect(computeRowPositions(5, "fill:20", 0, {}, () => 0, 80)).toMatchInlineSnapshot(`
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

test("computeRowPositions: should handle fill when there is enough space", () => {
  expect(computeRowPositions(5, "fill:20", 0, {}, () => 0, 200)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      40,
      80,
      120,
      160,
      200,
    ]
  `);

  expect(computeRowPositions(5, "fill:20", 0, {}, () => 0, 211)).toMatchInlineSnapshot(`
    Uint32Array [
      0,
      42,
      84,
      126,
      168,
      210,
    ]
  `);

  expect(computeRowPositions(5, "fill:21", 0, {}, () => 0, 177)).toMatchInlineSnapshot(`
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
