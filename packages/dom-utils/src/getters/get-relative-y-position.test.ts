import { describe, expect, test, vi } from "vitest";
import { getRelativeYPosition } from "./get-relative-y-position.js";

describe("getRelativeXPosition", () => {
  test("Should return the relative y position both left and right", () => {
    const element = document.createElement("div");
    vi.spyOn(element, "getBoundingClientRect").mockImplementation(() => {
      return {
        left: 20,
        right: 30,
        bottom: 30,
        top: 20,
        x: 20,
        y: 20,
        height: 10,
        width: 10,
        toJSON: () => "",
      };
    });

    vi.spyOn(element, "offsetHeight", "get").mockImplementation(() => 200);
    vi.spyOn(element, "clientHeight", "get").mockImplementation(() => 195);

    expect(getRelativeYPosition(element, 22)).toMatchInlineSnapshot(`
      {
        "bot": 3,
        "top": 2,
      }
    `);
  });
});
