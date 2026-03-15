import { describe, expect, test } from "vitest";
import { partitionColumnsByPinState } from "./partition-columns-by-pin-state.js";

describe("partitionColumnsByPinState", () => {
  test("Should return three empty arrays when candidates is empty", () => {
    const result = partitionColumnsByPinState([]);

    expect(result.start).toEqual([]);
    expect(result.center).toEqual([]);
    expect(result.end).toEqual([]);
  });

  test("Should place a column with pin 'start' into the start array", () => {
    const col = { id: "col1", pin: "start" as const };
    const result = partitionColumnsByPinState([col]);

    expect(result.start).toEqual([col]);
    expect(result.center).toEqual([]);
    expect(result.end).toEqual([]);
  });

  test("Should place a column with pin 'end' into the end array", () => {
    const col = { id: "col1", pin: "end" as const };
    const result = partitionColumnsByPinState([col]);

    expect(result.start).toEqual([]);
    expect(result.center).toEqual([]);
    expect(result.end).toEqual([col]);
  });

  test("Should place a column with no pin into the center array", () => {
    const col = { id: "col1" };
    const result = partitionColumnsByPinState([col]);

    expect(result.start).toEqual([]);
    expect(result.center).toEqual([col]);
    expect(result.end).toEqual([]);
  });

  test("Should place a column with an explicit pin of undefined into the center array", () => {
    const col = { id: "col1", pin: undefined };
    const result = partitionColumnsByPinState([col]);

    expect(result.start).toEqual([]);
    expect(result.center).toEqual([col]);
    expect(result.end).toEqual([]);
  });

  test("Should correctly partition a mixed set of columns across all three sections", () => {
    const s1 = { id: "s1", pin: "start" as const };
    const c1 = { id: "c1" };
    const e1 = { id: "e1", pin: "end" as const };
    const s2 = { id: "s2", pin: "start" as const };
    const c2 = { id: "c2" };
    const result = partitionColumnsByPinState([s1, c1, e1, s2, c2]);

    expect(result.start).toEqual([s1, s2]);
    expect(result.center).toEqual([c1, c2]);
    expect(result.end).toEqual([e1]);
  });

  test("Should preserve the order of columns within each section", () => {
    const s1 = { id: "s1", pin: "start" as const };
    const s2 = { id: "s2", pin: "start" as const };
    const s3 = { id: "s3", pin: "start" as const };
    const result = partitionColumnsByPinState([s1, s2, s3]);

    expect(result.start).toEqual([s1, s2, s3]);
  });
});
