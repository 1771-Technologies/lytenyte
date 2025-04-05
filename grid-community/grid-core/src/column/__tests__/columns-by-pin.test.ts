import type { ColumnPin } from "@1771technologies/grid-types/core";
import { columnsByPin } from "../columns-by-pin.js";

interface TestColumn {
  id: string;
  pin: ColumnPin;
}

test("correctly groups columns by pin position", () => {
  const columns: TestColumn[] = [
    { id: "1", pin: "start" },
    { id: "2", pin: null },
    { id: "3", pin: "end" },
    { id: "4", pin: null },
    { id: "5", pin: "start" },
    { id: "6", pin: "end" },
  ];

  const result = columnsByPin(columns);

  expect(result.start).toEqual([
    { id: "1", pin: "start" },
    { id: "5", pin: "start" },
  ]);
  expect(result.center).toEqual([
    { id: "2", pin: null },
    { id: "4", pin: null },
  ]);
  expect(result.end).toEqual([
    { id: "3", pin: "end" },
    { id: "6", pin: "end" },
  ]);
});

test("maintains original order within each group", () => {
  const columns: TestColumn[] = [
    { id: "start1", pin: "start" },
    { id: "start2", pin: "start" },
    { id: "center1", pin: null },
    { id: "center2", pin: null },
    { id: "end1", pin: "end" },
    { id: "end2", pin: "end" },
  ];

  const result = columnsByPin(columns);

  expect(result.start.map((c) => c.id)).toEqual(["start1", "start2"]);
  expect(result.center.map((c) => c.id)).toEqual(["center1", "center2"]);
  expect(result.end.map((c) => c.id)).toEqual(["end1", "end2"]);
});

test("handles empty array", () => {
  const result = columnsByPin([]);

  expect(result.start).toEqual([]);
  expect(result.center).toEqual([]);
  expect(result.end).toEqual([]);
});

test("handles array with single pin type", () => {
  const centerOnlyColumns: TestColumn[] = [
    { id: "1", pin: null },
    { id: "2", pin: null },
    { id: "3", pin: null },
  ];

  const result = columnsByPin(centerOnlyColumns);

  expect(result.start).toEqual([]);
  expect(result.center).toEqual(centerOnlyColumns);
  expect(result.end).toEqual([]);
});

test("works with additional column properties", () => {
  interface ExtendedColumn extends TestColumn {
    name: string;
    width: number;
  }

  const columns: ExtendedColumn[] = [
    { id: "1", pin: "start", name: "First", width: 100 },
    { id: "2", pin: null, name: "Second", width: 150 },
    { id: "3", pin: "end", name: "Third", width: 120 },
  ];

  const result = columnsByPin(columns);

  expect(result.start[0]).toEqual(columns[0]);
  expect(result.center[0]).toEqual(columns[1]);
  expect(result.end[0]).toEqual(columns[2]);
});

test("handles large number of columns", () => {
  const largeColumnSet: TestColumn[] = Array.from({ length: 1000 }, (_, i) => ({
    id: i.toString(),
    pin: i % 3 === 0 ? "start" : i % 3 === 1 ? null : "end",
  }));

  const result = columnsByPin(largeColumnSet);

  expect(result.start).toHaveLength(334);
  expect(result.center).toHaveLength(333);
  expect(result.end).toHaveLength(333);
  expect(result.start.every((col) => col.pin === "start")).toBe(true);
  expect(result.center.every((col) => col.pin === null)).toBe(true);
  expect(result.end.every((col) => col.pin === "end")).toBe(true);
});
