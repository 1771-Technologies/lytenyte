import { describe, test, expect, vi, afterEach } from "vitest";
import * as isNodeModule from "../is-node.js";
import { getDocumentElement } from "../get-document-element.js";

describe("getDocumentElement", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should return node.ownerDocument.documentElement when input is a Node", () => {
    const mockDocumentElement = {} as HTMLElement;
    const mockOwnerDocument = {
      documentElement: mockDocumentElement,
    };
    const mockNode = {
      ownerDocument: mockOwnerDocument,
    };

    vi.spyOn(isNodeModule, "isNode").mockReturnValue(true);

    const result = getDocumentElement(mockNode as unknown as Node);
    expect(result).toBe(mockDocumentElement);
  });

  test("should return node.document.documentElement when input is a Window", () => {
    const mockDocumentElement = {} as HTMLElement;
    const mockWindow = {
      document: {
        documentElement: mockDocumentElement,
      },
    };

    vi.spyOn(isNodeModule, "isNode").mockReturnValue(false);

    const result = getDocumentElement(mockWindow as unknown as Window);
    expect(result).toBe(mockDocumentElement);
  });

  test("should fall back to window.document.documentElement if everything else fails", () => {
    vi.spyOn(isNodeModule, "isNode").mockReturnValue(false);

    const brokenWindow = {
      document: null,
    };

    const result = getDocumentElement(brokenWindow as unknown as Window);
    expect(result).toBe(window.document.documentElement);
  });
});
