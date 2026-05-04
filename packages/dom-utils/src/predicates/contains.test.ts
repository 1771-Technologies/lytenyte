import { describe, expect, test } from "vitest";
import { contains } from "./contains.js";

describe("contains", () => {
  test("Should return false when the parent is not an HTML element", () => {
    const items: any[] = [];
    const parent = {
      append: (c: any) => items.push(c),
      contains: (c: any) => items.includes(c),
    } as unknown as Element;

    const child = document.createElement("div");
    parent.append(child);

    expect(contains(parent, child)).toEqual(false);
  });

  test("Should return false when the child is not an HTML element", () => {
    const parent = document.createElement("div");
    const child = {} as Element;
    parent.append(child);

    expect(contains(parent, child)).toEqual(false);
  });

  test("Should return true when parent and child are the same element", () => {
    const parent = document.createElement("div");

    expect(contains(parent, parent)).toEqual(true);
  });

  test("Should return true when the parent directly contains the child", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("Should return true when the child is deeply nested inside the parent", () => {
    const parent = document.createElement("div");
    const subParent = document.createElement("div");
    parent.appendChild(subParent);
    const child = document.createElement("div");
    subParent.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("Should return true when the child is in an open shadow root", () => {
    const parent = document.createElement("div");
    const openShadow = parent.attachShadow({ mode: "open" });
    const child = document.createElement("child");
    openShadow.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("Should return true when the child is assigned to a slot in a shadow root", () => {
    const parent = document.createElement("div");
    const shadowWithSlot = parent.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    shadowWithSlot.append(slot);
    const child = document.createElement("div");
    parent.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("Should return true when the child is nested within nested shadow roots", () => {
    const outer = document.createElement("div");
    const outerShadow = outer.attachShadow({ mode: "open" });
    const innerHost = document.createElement("div");
    outerShadow.appendChild(innerHost);
    const innerShadow = innerHost.attachShadow({ mode: "open" });
    const child = document.createElement("div");

    innerShadow.appendChild(child);

    expect(contains(outer, child)).toEqual(true);
  });

  test("Should return true when the child is in a closed shadow root", () => {
    const parent = document.createElement("div");
    const closedRoot = parent.attachShadow({ mode: "closed" });
    const child = document.createElement("div");
    closedRoot.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("Should return false when the child is not contained by the parent", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");

    expect(contains(parent, child)).toEqual(false);
  });
});
