import { describe, expect, test, vi } from "vitest";
import { getParentNode } from "../get-parent-node.js";
import { getDocumentElement } from "../get-document-element.js";

describe("getParentNode", () => {
  test("when the element has an assigned slot it should be returned", () => {
    const d = document.createElement("div");
    const slot = document.createElement("slot");
    vi.spyOn(d, "assignedSlot", "get").mockImplementation(() => slot);

    expect(getParentNode(d)).toBe(slot);
  });

  test("when the element has a parent node that should be returned", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.appendChild(child);

    expect(getParentNode(child)).toBe(parent);
  });

  test("when the <html/> element is provided it should return the <html/> element", () => {
    const el = document.querySelector("html")!;
    expect(getParentNode(el)).toBe(el);
  });

  test("when the node is a shadow root, its host value should be returned", () => {
    const node = document.createElement("div");
    const root = node.attachShadow({ mode: "open" });

    expect(getParentNode(root)).toBe(node);
  });

  test("when the node is does not have a parent the document element should be returned", () => {
    const node = document.createElement("div");

    expect(getParentNode(node)).toBe(getDocumentElement(document));
  });

  test("when the hosted node is itself a shadow root the host should be returned", () => {
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
