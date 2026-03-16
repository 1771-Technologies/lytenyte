import { describe, expect, test, vi } from "vitest";
import { getFocusables } from "./get-focusables.js";

describe("getFocusables", () => {
  test("Should return an empty array when there are no focusable elements", async () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    expect(getFocusables(div)).toEqual([]);
  });
  test("Should return an empty array when children are not focusable", async () => {
    const div = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getFocusables(div)).toEqual([]);
  });

  test("Should return an empty array when the container is null", () => {
    expect(getFocusables(null)).toEqual([]);
  });

  test("Should return all focusable children", () => {
    const div = document.createElement("div");
    const child1 = document.createElement("div");
    child1.tabIndex = -1;
    const child2 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getFocusables(div)).toEqual([child1, child2]);
  });

  test("Should include the container when includeContainer is if-empty and no focusable children exist", () => {
    const div = document.createElement("div");
    div.tabIndex = -1;
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getFocusables(div, "if-empty")).toEqual([div]);
  });

  test("Should include the container when includeContainer is true", () => {
    const div = document.createElement("div");
    div.tabIndex = -1;
    const child1 = document.createElement("button");
    const child2 = document.createElement("button");
    div.appendChild(child1);
    div.appendChild(child2);

    document.body.appendChild(div);

    expect(getFocusables(div, true)).toEqual([div, child1, child2]);
  });

  test("Should return focusable elements within nested iframes", () => {
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
