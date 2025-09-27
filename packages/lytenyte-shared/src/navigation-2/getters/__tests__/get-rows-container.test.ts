import { describe, expect, test } from "vitest";
import { getRowsContainer } from "../get-rows-container.js";

describe("getRowsContainer", () => {
  test("should return the correct result", () => {
    const container = document.createElement("div");
    expect(getRowsContainer(container)).toEqual(null);
    const section = document.createElement("div");
    section.setAttribute("data-ln-rows-container", "true");
    container.appendChild(section);

    expect(getRowsContainer(container)).toEqual(section);
  });
});
