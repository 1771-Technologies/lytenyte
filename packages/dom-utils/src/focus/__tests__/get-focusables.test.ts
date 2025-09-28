import { describe, expect, test, vi } from "vitest";
import { getFocusables } from "../get-focusables.js";

describe("getFocusables", () => {
  test("when the element is not defined it should return an empty array", async () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    expect(getFocusables(div)).toEqual([]);
  });
  test("when the element is defined by there are no focusables it should return an empty array", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getFocusables(div)).toEqual([]);
  });

  test("when teh element provided is invalid it should return an empty array", () => {
    expect(getFocusables(null)).toEqual([]);
  });

  test("when the element has some focusables these should be returned", () => {
    const div = document.createElement("div");
    const child1 = document.createElement("div");
    child1.tabIndex = -1;
    const child2 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getFocusables(div)).toEqual([child1, child2]);
  });

  test("when the element is empty but it is focusable it should be returned", () => {
    const div = document.createElement("div");
    div.tabIndex = -1;
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getFocusables(div, "if-empty")).toEqual([div]);
  });

  test("when the element is not empty but it should also be returned, it is", () => {
    const div = document.createElement("div");
    div.tabIndex = -1;
    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getFocusables(div, true)).toEqual([div, child1, child2]);
  });

  test("when the focusable are in an iframe they should also be returned", () => {
    const div = document.createElement("div");
    const frame = document.createElement("iframe");
    div.appendChild(frame);

    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    vi.spyOn(child1, "offsetHeight", "get").mockImplementation(() => 100);
    vi.spyOn(child2, "offsetHeight", "get").mockImplementation(() => 100);
    const frameBody = document.createElement("div");
    frameBody.appendChild(child1);
    frameBody.appendChild(child2);

    document.body.appendChild(div);

    const contentDocument = {
      body: frameBody,
    };
    vi.spyOn(frame, "contentDocument", "get").mockImplementation(() => contentDocument as any);

    expect(getFocusables(div)).toEqual([child1, child2]);
  });
});
