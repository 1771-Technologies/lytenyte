import { describe, test, expect, vi, afterEach } from "vitest";
import { getNearestOverflowAncestor } from "../get-nearest-overflow-ancestor.js";

import * as getParentNodeModule from "../get-parent-node.js";
import * as isHTMLElementModule from "../is-html-element.js";
import * as isLastTraversableNodeModule from "../is-last-traversable-node.js";
import * as isOverflowElementModule from "../is-overflow-element.js";

describe("getNearestOverflowAncestor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns document.body when isLastTraversableNode is true", () => {
    const mockBody = {} as HTMLElement;
    const mockDoc = {
      body: mockBody,
    } as unknown as Document;
    const mockNode = {
      ownerDocument: mockDoc,
    } as unknown as Node;

    vi.spyOn(getParentNodeModule, "getParentNode").mockReturnValue({} as Node);
    vi.spyOn(isLastTraversableNodeModule, "isLastTraversableNode").mockReturnValue(true);

    const result = getNearestOverflowAncestor(mockNode);
    expect(result).toBe(mockBody);
  });

  test("returns fallback body if node.ownerDocument is undefined (assumes node is Document)", () => {
    const mockBody = {} as HTMLElement;
    const mockDocNode = {
      body: mockBody,
    } as unknown as Document;

    vi.spyOn(getParentNodeModule, "getParentNode").mockReturnValue({} as Node);
    vi.spyOn(isLastTraversableNodeModule, "isLastTraversableNode").mockReturnValue(true);

    const result = getNearestOverflowAncestor(mockDocNode);
    expect(result).toBe(mockBody);
  });

  test("returns parent node if it is an overflow element", () => {
    const parent = {} as HTMLElement;
    const mockNode = {} as Node;

    vi.spyOn(getParentNodeModule, "getParentNode").mockReturnValue(parent);
    vi.spyOn(isLastTraversableNodeModule, "isLastTraversableNode").mockReturnValue(false);
    vi.spyOn(isHTMLElementModule, "isHTMLElement").mockReturnValue(true);
    vi.spyOn(isOverflowElementModule, "isOverflowElement").mockReturnValue(true);

    const result = getNearestOverflowAncestor(mockNode);
    expect(result).toBe(parent);
  });

  test("recursively finds the nearest overflow ancestor", () => {
    const ancestor = {} as HTMLElement;
    const node = {} as Node;
    const midNode = {} as HTMLElement;

    const getParentNode = vi
      .spyOn(getParentNodeModule, "getParentNode")
      .mockImplementationOnce(() => midNode)
      .mockImplementationOnce(() => ancestor);

    vi.spyOn(isLastTraversableNodeModule, "isLastTraversableNode").mockReturnValue(false);

    vi.spyOn(isHTMLElementModule, "isHTMLElement").mockImplementation(
      (el) => el === midNode || el === ancestor,
    );

    vi.spyOn(isOverflowElementModule, "isOverflowElement").mockImplementation(
      (el) => el === ancestor,
    );

    const result = getNearestOverflowAncestor(node);
    expect(result).toBe(ancestor);
    expect(getParentNode).toHaveBeenCalledTimes(2);
  });
});
