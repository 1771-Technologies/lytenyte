import { describe, expect, test, vi } from "vitest";
import { getNextTabbable } from "../get-next-tabbable.js";

describe("getNextTabbable", () => {
  test("when there are multiple children it should return the next tabbable", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("button");
    child1.textContent = "child 1";
    const child2 = document.createElement("button");
    child2.textContent = "child 2";
    const child3 = document.createElement("button");
    child3.textContent = "child 3";
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    await expect.element(child1).toBeVisible();

    child1.focus();
    await expect.element(child1).toHaveFocus();

    expect(getNextTabbable(div)).toBe(child2);
    expect(getNextTabbable(div, child2)).toBe(child3);
  });

  test("when there is no active element it should return null", () => {
    const div = document.createElement("div");
    const child1 = document.createElement("button");
    child1.textContent = "child 1";
    const child2 = document.createElement("button");
    child2.textContent = "child 2";
    const child3 = document.createElement("button");
    child3.textContent = "child 3";
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    vi.spyOn(document, "activeElement", "get").mockImplementation(() => null);
    expect(getNextTabbable(div)).toEqual(null);
  });

  test("when the active element is not a child of the container the first tabbable should be returned", () => {
    const div = document.createElement("div");
    const child1 = document.createElement("button");
    child1.textContent = "child 1";
    const child2 = document.createElement("button");
    child2.textContent = "child 2";
    const child3 = document.createElement("button");
    child3.textContent = "child 3";
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    expect(getNextTabbable(div)).toEqual(child1);
  });

  test("when the last tabbable is focused it should returned null", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("button");
    child1.textContent = "child 1";
    const child2 = document.createElement("button");
    child2.textContent = "child 2";
    const child3 = document.createElement("button");
    child3.textContent = "child 3";
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    child3.focus();
    await expect.element(child3).toHaveFocus();

    expect(getNextTabbable(div)).toEqual(null);
  });

  test("when the container provided is null it should return null", () => {
    expect(getNextTabbable(null)).toEqual(null);
  });
});
