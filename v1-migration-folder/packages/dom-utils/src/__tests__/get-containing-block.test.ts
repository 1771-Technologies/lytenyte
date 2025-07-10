import { describe, test, expect, vi, afterEach } from "vitest";

import * as getParentNodeModule from "../get-parent-node.js";
import * as isContainingBlockModule from "../is-containing-block.js";
import * as isHTMLElementModule from "../is-html-element.js";
import * as isLastTraversableNodeModule from "../is-last-traversable-node.js";
import * as isTopLayerModule from "../is-top-layer.js";
import { getContainingBlock } from "../get-containing-block.js";

describe("getContainingBlock", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns null if first parent is not an HTMLElement", () => {
    const element = {} as Element;

    vi.spyOn(getParentNodeModule, "getParentNode").mockReturnValue({} as Node);
    vi.spyOn(isHTMLElementModule, "isHTMLElement").mockReturnValue(false);

    const result = getContainingBlock(element);
    expect(result).toBeNull();
  });

  test("returns the first parent that is a containing block", () => {
    const element = {} as Element;
    const parent1 = {} as HTMLElement;

    const getParentNode = vi
      .spyOn(getParentNodeModule, "getParentNode")
      .mockImplementationOnce(() => parent1);

    vi.spyOn(isHTMLElementModule, "isHTMLElement").mockReturnValue(true);
    vi.spyOn(isLastTraversableNodeModule, "isLastTraversableNode").mockReturnValue(false);
    vi.spyOn(isContainingBlockModule, "isContainingBlock").mockReturnValue(true);
    vi.spyOn(isTopLayerModule, "isTopLayer").mockReturnValue(false);

    const result = getContainingBlock(element);
    expect(result).toBe(parent1);
    expect(getParentNode).toHaveBeenCalledTimes(1);
  });

  test("returns null if isTopLayer returns true on a traversed node", () => {
    const element = {} as Element;
    const parent = {} as HTMLElement;

    vi.spyOn(getParentNodeModule, "getParentNode").mockReturnValueOnce(parent);
    vi.spyOn(isHTMLElementModule, "isHTMLElement").mockReturnValue(true);
    vi.spyOn(isLastTraversableNodeModule, "isLastTraversableNode").mockReturnValue(false);
    vi.spyOn(isContainingBlockModule, "isContainingBlock").mockReturnValue(false);
    vi.spyOn(isTopLayerModule, "isTopLayer").mockReturnValue(true);

    const result = getContainingBlock(element);
    expect(result).toBeNull();
  });

  test("returns null after traversing without finding a containing block", () => {
    const element = {} as Element;
    const parent1 = {} as HTMLElement;
    const parent2 = {} as HTMLElement;

    const getParentNode = vi
      .spyOn(getParentNodeModule, "getParentNode")
      .mockImplementationOnce(() => parent1)
      .mockImplementationOnce(() => parent2)
      .mockImplementation(() => null as any); // terminate traversal

    vi.spyOn(isHTMLElementModule, "isHTMLElement").mockImplementation(
      (node) => node === parent1 || node === parent2,
    );

    vi.spyOn(isLastTraversableNodeModule, "isLastTraversableNode").mockReturnValue(false);

    vi.spyOn(isContainingBlockModule, "isContainingBlock").mockReturnValue(false);
    vi.spyOn(isTopLayerModule, "isTopLayer").mockReturnValue(false);

    const result = getContainingBlock(element);
    expect(result).toBeNull();
    expect(getParentNode).toHaveBeenCalledTimes(3);
  });

  test("stops traversal if isLastTraversableNode is true", () => {
    const element = {} as Element;
    const parent = {} as HTMLElement;

    vi.spyOn(getParentNodeModule, "getParentNode").mockReturnValueOnce(parent);
    vi.spyOn(isHTMLElementModule, "isHTMLElement").mockReturnValue(true);
    vi.spyOn(isLastTraversableNodeModule, "isLastTraversableNode").mockReturnValue(true);

    const result = getContainingBlock(element);
    expect(result).toBeNull();
  });
});
