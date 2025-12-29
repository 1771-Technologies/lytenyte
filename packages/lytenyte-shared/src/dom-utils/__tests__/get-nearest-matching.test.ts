import { describe, expect, test } from "vitest";
import { getNearestMatching } from "../get-nearest-matching.js";

describe("getNearestMatching", () => {
  test("when the start matches the predicate it should be returned", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    const nestedChild = document.createElement("div");

    child.setAttribute("data-match", "1");
    nestedChild.setAttribute("data-match", "2");

    parent.appendChild(child);
    child.appendChild(nestedChild);

    expect(getNearestMatching(child, (el) => el.getAttribute("data-match") === "1")).toBe(child);
  });

  test("when the child is deeply nested it should return the correct parent", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    const nestedChild = document.createElement("div");

    parent.setAttribute("data-parent", "true");
    child.setAttribute("data-match", "1");
    nestedChild.setAttribute("data-match", "2");

    parent.appendChild(child);
    child.appendChild(nestedChild);

    expect(getNearestMatching(nestedChild, (el) => el.getAttribute("data-parent") === "true")).toBe(parent);
  });

  test("if there is no matching element should return null", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    const nestedChild = document.createElement("div");

    parent.setAttribute("data-parent", "true");
    child.setAttribute("data-match", "1");
    nestedChild.setAttribute("data-match", "2");

    parent.appendChild(child);
    child.appendChild(nestedChild);

    expect(getNearestMatching(nestedChild, (el) => el.getAttribute("data-parent") === "false")).toEqual(null);
  });
});
