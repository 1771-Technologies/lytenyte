import { describe, expect, test } from "vitest";
import { getLastTabbable } from "../get-last-tabbable.js";
import { wait } from "../../../js-utils/index.js";

describe("getLastTabbable", () => {
  test("when there are multiple items in a div it should return the last one that is tabbable", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    const child3 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    await wait();

    expect(getLastTabbable(div)).toBe(child3);
  });

  test("when there multiple tab items but a negative tab index is present it should be ignored", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("button");
    const child3 = document.createElement("button");
    child3.tabIndex = -1;
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    await wait();

    expect(getLastTabbable(div)).toBe(child2);
  });

  test("when there are no tabbable elements the container should be returned", async () => {
    const div = document.createElement("div");
    div.tabIndex = 0;

    document.body.appendChild(div);
    await wait();

    expect(getLastTabbable(div, "if-empty")).toBe(div);
  });

  test("when there are no tabbable elements and the container is empty and not focusable it should return null", async () => {
    const div = document.createElement("div");

    document.body.appendChild(div);
    await wait();

    expect(getLastTabbable(div, "if-empty")).toEqual(null);
  });

  test("when the container should be returned the last tabbable is still returned", async () => {
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

    expect(getLastTabbable(div, true)).toBe(child3);
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

    expect(getLastTabbable(div, true)).toEqual(null);
  });

  test("when the tab indices are different from zero the correct element should be returned", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("button");
    const child2 = document.createElement("div");
    child2.tabIndex = 1;
    const child3 = document.createElement("div");
    child3.tabIndex = 1;
    div.appendChild(child1);
    div.appendChild(child2);
    div.appendChild(child3);

    document.body.appendChild(div);

    await wait();
    expect(getLastTabbable(div)).toBe(child1);
  });
});
