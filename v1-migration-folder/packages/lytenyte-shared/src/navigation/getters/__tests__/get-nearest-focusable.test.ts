import { afterEach, describe, expect, test, vi } from "vitest";
import { getNearestFocusable } from "../get-nearest-focusable";

describe("getNearestFocusable", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  test("should handle the case where a column header is the nearest focusable", () => {
    const header = document.createElement("div");
    const button = document.createElement("button");
    header.appendChild(button);
    header.setAttribute("data-ln-header-cell", "true");

    expect(getNearestFocusable(button)).toEqual(header);
    expect(getNearestFocusable(header)).toEqual(header);

    vi.spyOn(document, "activeElement", "get").mockImplementation(() => header);
    expect(getNearestFocusable()).toEqual(header);
  });

  test("should handle the case where a column group is the nearest focusable", () => {
    const headerGroup = document.createElement("div");
    const button = document.createElement("button");
    const icon = document.createElement("button");
    button.appendChild(icon);
    headerGroup.appendChild(button);
    headerGroup.setAttribute("data-ln-header-group", "true");

    expect(getNearestFocusable(icon)).toEqual(headerGroup);
    expect(getNearestFocusable(headerGroup)).toEqual(headerGroup);

    vi.spyOn(document, "activeElement", "get").mockImplementation(() => headerGroup);
    expect(getNearestFocusable()).toEqual(headerGroup);
  });

  test("should handle the case where a cell is the nearest focusable", () => {
    const cell = document.createElement("div");
    const button = document.createElement("button");
    const icon = document.createElement("button");
    button.appendChild(icon);
    cell.appendChild(button);
    cell.setAttribute("data-ln-cell", "true");

    expect(getNearestFocusable(icon)).toEqual(cell);
    expect(getNearestFocusable(cell)).toEqual(cell);

    vi.spyOn(document, "activeElement", "get").mockImplementation(() => cell);
    expect(getNearestFocusable()).toEqual(cell);
  });

  test("should handle the case where a full width row is the nearest focusable", () => {
    const cell = document.createElement("div");
    const button = document.createElement("button");
    const icon = document.createElement("button");
    button.appendChild(icon);
    cell.appendChild(button);
    cell.setAttribute("data-ln-row", "true");
    cell.setAttribute("data-ln-rowtype", "full-width");

    expect(getNearestFocusable(icon)).toEqual(cell);
    expect(getNearestFocusable(cell)).toEqual(cell);

    vi.spyOn(document, "activeElement", "get").mockImplementation(() => cell);
    expect(getNearestFocusable()).toEqual(cell);
  });

  test("should handle the case where there is no nearest focusable", () => {
    const cell = document.createElement("div");
    const button = document.createElement("button");
    const icon = document.createElement("button");
    button.appendChild(icon);
    cell.appendChild(button);

    expect(getNearestFocusable(icon)).toEqual(null);

    vi.spyOn(document, "activeElement", "get").mockImplementation(() => cell);
    expect(getNearestFocusable()).toEqual(null);
  });

  test("should handle the case where there is no nearest focusable and we reach viewport", () => {
    const container = document.createElement("div");
    container.setAttribute("data-ln-viewport", "true");
    const cell = document.createElement("div");
    const button = document.createElement("button");
    const icon = document.createElement("button");
    button.appendChild(icon);
    cell.appendChild(button);

    container.appendChild(cell);

    expect(getNearestFocusable(icon)).toEqual(null);

    vi.spyOn(document, "activeElement", "get").mockImplementation(() => cell);
    expect(getNearestFocusable()).toEqual(null);
  });

  test("should handle the case where there is no nearest focusable and we reach viewport", () => {
    vi.spyOn(document, "activeElement", "get").mockImplementation(() => null);
    expect(getNearestFocusable()).toEqual(null);
  });
});
