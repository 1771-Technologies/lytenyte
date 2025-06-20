import { describe, test, expect, vi, afterEach } from "vitest";
import * as getNodeNameModule from "../get-node-name.js";
import { isLastTraversableNode } from "../is-last-traversable-node.js";

describe("isLastTraversableNode", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns true for "html"', () => {
    const mockNode = {} as Node;
    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("html");

    expect(isLastTraversableNode(mockNode)).toBe(true);
  });

  test('returns true for "body"', () => {
    const mockNode = {} as Node;
    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("body");

    expect(isLastTraversableNode(mockNode)).toBe(true);
  });

  test('returns true for "#document"', () => {
    const mockNode = {} as Node;
    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("#document");

    expect(isLastTraversableNode(mockNode)).toBe(true);
  });

  test("returns false for any other node name", () => {
    const mockNode = {} as Node;
    vi.spyOn(getNodeNameModule, "getNodeName").mockReturnValue("div");

    expect(isLastTraversableNode(mockNode)).toBe(false);
  });
});
