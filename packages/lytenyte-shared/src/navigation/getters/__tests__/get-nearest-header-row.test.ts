import { afterEach, describe, expect, test, vi } from "vitest";
import { getNearestHeaderRow } from "../get-nearest-header-row.js";

describe("getNearestHeaderRow", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should return the correct value", () => {
    const el = document.createElement("div");
    const cell = document.createElement("div");

    cell.append(el);
    expect(getNearestHeaderRow(el)).toEqual(null);

    vi.spyOn(document, "activeElement", "get").mockImplementation(() => cell);
    expect(getNearestHeaderRow()).toEqual(null);
    vi.spyOn(document, "activeElement", "get").mockImplementation(() => null);
    expect(getNearestHeaderRow()).toEqual(null);

    const row = document.createElement("div");
    row.setAttribute("data-ln-header-row", "true");
    row.appendChild(cell);

    expect(getNearestHeaderRow(el)).toEqual(row);
    expect(getNearestHeaderRow(row)).toEqual(row);
  });
});
