import { describe, expect, test } from "vitest";
import { contains } from "../contains.js";

describe("contains", () => {
  test("when the parent target is not an HTML element should return false", () => {
    const items: any[] = [];
    const parent = {
      append: (c: any) => items.push(c),
      contains: (c: any) => items.includes(c),
    } as unknown as Element;

    const child = document.createElement("div");
    parent.append(child);

    expect(contains(parent, child)).toEqual(false);
  });

  test("when the child target is not an HTML element should return false", () => {
    const parent = document.createElement("div");
    const child = {} as Element;
    parent.append(child);

    expect(contains(parent, child)).toEqual(false);
  });

  test("when the parent is the same element as the child it should return true", () => {
    const parent = document.createElement("div");

    expect(contains(parent, parent)).toEqual(true);
  });

  test("when the parent directly contains the child it should return true", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("when the child is nested but contained in the parent it should return true", () => {
    const parent = document.createElement("div");
    const subParent = document.createElement("div");
    parent.appendChild(subParent);
    const child = document.createElement("div");
    subParent.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("when the child is in an open shadow root it should return true", () => {
    const parent = document.createElement("div");
    const openShadow = parent.attachShadow({ mode: "open" });
    const child = document.createElement("child");
    openShadow.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("when the child is a slot in a shadow root it should return true", () => {
    const parent = document.createElement("div");
    const shadowWithSlot = parent.attachShadow({ mode: "open" });
    const slot = document.createElement("slot");
    shadowWithSlot.append(slot);
    const child = document.createElement("div");
    parent.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("when the child is nested in the shadow root", () => {
    const outer = document.createElement("div");
    const outerShadow = outer.attachShadow({ mode: "open" });
    const innerHost = document.createElement("div");
    outerShadow.appendChild(innerHost);
    const innerShadow = innerHost.attachShadow({ mode: "open" });
    const child = document.createElement("div");

    innerShadow.appendChild(child);

    expect(contains(outer, child)).toEqual(true);
  });

  test("when the child is in a closed shadow it should return true", () => {
    const parent = document.createElement("div");
    const closedRoot = parent.attachShadow({ mode: "closed" });
    const child = document.createElement("div");
    closedRoot.appendChild(child);

    expect(contains(parent, child)).toEqual(true);
  });

  test("when the child is not contained by the parent should return false", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");

    expect(contains(parent, child)).toEqual(false);
  });
});
