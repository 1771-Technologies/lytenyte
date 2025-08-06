import { describe, test, expect, vi, afterEach } from "vitest";
import * as isNodeModule from "../is-node.js";
import { getNodeName } from "../get-node-name.js";

describe("getNodeName", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns lowercased nodeName when input is a Node", () => {
    const mockNode = {
      nodeName: "DIV",
    };

    vi.spyOn(isNodeModule, "isNode").mockReturnValue(true);

    const result = getNodeName(mockNode as unknown as Node);
    expect(result).toBe("div");
  });

  test("returns empty string lowercased when nodeName is undefined on a Node", () => {
    const mockNode = {};

    vi.spyOn(isNodeModule, "isNode").mockReturnValue(true);

    const result = getNodeName(mockNode as unknown as Node);
    expect(result).toBe("");
  });

  test('returns "#document" when input is not a Node (e.g., Window)', () => {
    const mockWindow = {};

    vi.spyOn(isNodeModule, "isNode").mockReturnValue(false);

    const result = getNodeName(mockWindow as Window);
    expect(result).toBe("#document");
  });
});
