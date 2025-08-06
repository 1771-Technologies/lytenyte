import { describe, expect, test } from "vitest";
import { getRowsCenterSection } from "../get-rows-center-section";

describe("getRowsCenterSection", () => {
  test("should return the correct result", () => {
    const container = document.createElement("div");
    expect(getRowsCenterSection(container)).toEqual(null);
    const section = document.createElement("div");
    section.setAttribute("data-ln-rows-center", "true");
    container.appendChild(section);

    expect(getRowsCenterSection(container)).toEqual(section);
  });
});
