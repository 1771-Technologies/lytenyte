import { describe, expect, test, vi } from "vitest";
import { getParentNode } from "./get-parent-node.js";
import { getDocumentElement } from "./get-document-element.js";

describe("getParentNode", () => {
  test("Should return the assigned slot when the element has one", () => {
    const d = document.createElement("div");
    const slot = document.createElement("slot");
    vi.spyOn(d, "assignedSlot", "get").mockImplementation(() => slot);

    expect(getParentNode(d)).toBe(slot);
  });

  test("Should return the parent node when the element has one", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);

    expect(getParentNode(child)).toBe(parent);
  });

  test("Should return the html element itself when it is passed in", () => {
    const el = document.querySelector("html")!;
    expect(getParentNode(el)).toBe(el);
  });

  test("Should return the shadow host when the node is a shadow root", () => {
    const node = document.createElement("div");
    const root = node.attachShadow({ mode: "open" });

    expect(getParentNode(root)).toBe(node);
  });

  test("Should return the document element when the node has no parent", () => {
    const node = document.createElement("div");

    expect(getParentNode(node)).toBe(getDocumentElement(document));
  });

  test("Should return the host when the result node is itself a shadow root", () => {
    const node = document.createElement("div");
    const outer = node.attachShadow({ mode: "open" });
    const element = document.createElement("span");
    outer.appendChild(element);
    const inner = element.attachShadow({ mode: "open" });

    (element as any).host = node;
    vi.spyOn(element, "nodeType", "get").mockImplementation(() => 11);

    expect(getParentNode(inner)).toBe(node);
  });
});
