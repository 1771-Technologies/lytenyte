import { describe, test, expect, vi, afterEach } from "vitest";

import * as getNodeNameModule from "../get-node-name.js";
import * as isShadowRootModule from "../is-shadow-root.js";
import * as getDocumentElementModule from "../get-document-element.js";
import { getParentNode } from "../get-parent-node.js";

describe("getParentNode", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns node itself if nodeName is "html"', () => {
    const mockNode = {} as Node;
    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("html");

    const result = getParentNode(mockNode);
    expect(result).toBe(mockNode);
  });

  test("returns assignedSlot if present", () => {
    const assignedSlot = {} as Node;
    const mockNode = { assignedSlot } as unknown as Node;

    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("div");

    const result = getParentNode(mockNode);
    expect(result).toBe(assignedSlot);
  });

  test("returns parentNode if no assignedSlot and no ShadowRoot", () => {
    const parentNode = {} as Node;
    const mockNode = { parentNode } as unknown as Node;

    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("div");
    vi.spyOn(isShadowRootModule, "isShadowRoot").mockReturnValue(false);

    const result = getParentNode(mockNode);
    expect(result).toBe(parentNode);
  });

  test("returns node.host if node is a ShadowRoot", () => {
    const host = {} as Node;
    const shadowRootNode = {} as Node;

    const mockNode = {
      parentNode: null,
    } as unknown as Node;

    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("div");
    vi.spyOn(isShadowRootModule, "isShadowRoot").mockImplementation(
      (value) => value === shadowRootNode,
    );
    vi.spyOn(getDocumentElementModule, "getDocumentElement").mockReturnValue(shadowRootNode as any);

    (shadowRootNode as any).host = host;

    const result = getParentNode(mockNode);
    expect(result).toBe(host);
  });

  test("returns getDocumentElement fallback if no parent or shadow info", () => {
    const fallback = {} as any;
    const mockNode = {
      parentNode: null,
    } as unknown as Node;

    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("div");
    vi.spyOn(isShadowRootModule, "isShadowRoot").mockReturnValue(false);
    vi.spyOn(getDocumentElementModule, "getDocumentElement").mockReturnValue(fallback);

    const result = getParentNode(mockNode);
    expect(result).toBe(fallback);
  });

  test("unwraps ShadowRoot from fallback result", () => {
    const host = {} as Node;
    const shadowRoot = {} as any;

    const mockNode = {
      parentNode: null,
    } as unknown as Node;

    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("div");
    vi.spyOn(isShadowRootModule, "isShadowRoot").mockImplementation((v) => v === shadowRoot);
    vi.spyOn(getDocumentElementModule, "getDocumentElement").mockReturnValue(shadowRoot);

    (shadowRoot as any).host = host;

    const result = getParentNode(mockNode);
    expect(result).toBe(host);
  });
});
