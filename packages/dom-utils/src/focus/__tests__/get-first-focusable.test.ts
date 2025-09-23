import { describe, expect, test } from "vitest";
import { getFirstFocusable } from "../get-first-focusable.js";
import { wait } from "@1771technologies/lytenyte-js-utils";

describe("getFirstFocusable", () => {
  test("when there are multiple items in a div it should return the first one that is focusable", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    const child3 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    await wait();

    expect(getFirstFocusable(div)).toBe(child1);
  });

  test("when there are multiple items but one of them has a tab index set it is returned", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("button");
    const child3 = document.createElement("button");
    child1.tabIndex = -1;
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    await wait();

    expect(getFirstFocusable(div)).toBe(child1);
  });

  test("when there are no focusable elements the container should be returned", async () => {
    const div = document.createElement("div");
    div.tabIndex = 0;

    document.body.appendChild(div);
    await wait();

    expect(getFirstFocusable(div, "if-empty")).toBe(div);
  });

  test("when there are no focusable elements and the container is empty and not focusable it should return null", async () => {
    const div = document.createElement("div");

    document.body.appendChild(div);
    await wait();

    expect(getFirstFocusable(div, "if-empty")).toEqual(null);
  });

  test("when the container should be returned first it should be", async () => {
    const div = document.createElement("div");
    div.tabIndex = 0;
    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    const child3 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    await wait();

    expect(getFirstFocusable(div, true)).toBe(div);
  });

  test("when the container is not empty but none of the elements are focusable should return null", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");
    const child3 = document.createElement("div");
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    await wait();

    expect(getFirstFocusable(div, true)).toEqual(null);
  });
});
