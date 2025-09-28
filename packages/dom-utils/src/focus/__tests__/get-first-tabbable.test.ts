import { describe, expect, test } from "vitest";
import { getFirstTabbable } from "../get-first-tabbable.js";
import { wait } from "@1771technologies/lytenyte-js-utils";

describe("getFirstTabbable", () => {
  test("when there are multiple items in a div it should return the first one that is tabbable", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    const child3 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    await wait();

    expect(getFirstTabbable(div)).toBe(child1);
  });

  test("when there multiple tab items but a negative tab index is present it should be ignored", async () => {
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

    expect(getFirstTabbable(div)).toBe(child2);
  });

  test("when there are no tabbable elements the container should be returned", async () => {
    const div = document.createElement("div");
    div.tabIndex = 0;

    document.body.appendChild(div);
    await wait();

    expect(getFirstTabbable(div, "if-empty")).toBe(div);
  });

  test("when there are no tabbable elements and the container is empty and not focusable it should return null", async () => {
    const div = document.createElement("div");

    document.body.appendChild(div);
    await wait();

    expect(getFirstTabbable(div, "if-empty")).toEqual(null);
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

    expect(getFirstTabbable(div, true)).toBe(div);
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

    expect(getFirstTabbable(div, true)).toEqual(null);
  });
});
