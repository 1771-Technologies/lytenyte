import { afterEach, describe, expect, test, vi } from "vitest";
import { getNearestRow } from "../get-nearest-row";

describe("getNearestRow", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should return the correct value", () => {
    const el = document.createElement("div");
    const cell = document.createElement("div");

    cell.append(el);
    expect(getNearestRow(el)).toEqual(null);

    vi.spyOn(document, "activeElement", "get").mockImplementation(() => cell);
    expect(getNearestRow()).toEqual(null);
    vi.spyOn(document, "activeElement", "get").mockImplementation(() => null);
    expect(getNearestRow()).toEqual(null);

    const row = document.createElement("div");
    row.setAttribute("data-ln-row", "true");
    row.appendChild(cell);

    expect(getNearestRow(el)).toEqual(row);
    expect(getNearestRow(row)).toEqual(row);
  });
});
