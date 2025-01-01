import { getStringTableWidths } from "../get-string-table-widths.js";

describe("getStringTableWidths", () => {
  test("returns empty array for empty input", () => {
    expect(getStringTableWidths([])).toEqual([]);
  });

  test("handles single row with single column", () => {
    const input = [["hello"]];
    expect(getStringTableWidths(input)).toEqual([5]);
  });

  test("handles single row with multiple columns", () => {
    const input = [["a", "bb", "ccc"]];
    expect(getStringTableWidths(input)).toEqual([1, 2, 3]);
  });

  test("handles multiple rows with same length", () => {
    const input = [
      ["a", "bb", "ccc"],
      ["d", "ee", "fff"],
      ["g", "hh", "iii"],
    ];
    expect(getStringTableWidths(input)).toEqual([1, 2, 3]);
  });

  test("handles empty strings", () => {
    const input = [
      ["", "data", ""],
      ["more", "", "content"],
    ];
    expect(getStringTableWidths(input)).toEqual([4, 4, 7]);
  });

  test("handles rows shorter than the maximum width", () => {
    const input = [["complete", "row", "here"], ["short"], ["medium", "row"]];
    expect(getStringTableWidths(input)).toEqual([8, 3, 4]);
  });

  test("handles whitespace characters", () => {
    const input = [
      [" a ", " b  ", "   c"],
      ["  d", "e ", "f   "],
    ];
    expect(getStringTableWidths(input)).toEqual([3, 4, 4]);
  });
});
