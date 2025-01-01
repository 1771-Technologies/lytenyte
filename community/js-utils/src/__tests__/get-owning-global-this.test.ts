import { getOwningGlobalThis } from "../get-owning-global-this.js";

describe("getOwningGlobalThis", () => {
  let mockElement: any;
  let mockDocument: any;
  let mockWindow: any;

  beforeEach(() => {
    mockWindow = {
      someWindowProperty: "test",
    };

    mockDocument = {
      defaultView: mockWindow,
    };

    mockElement = {
      ownerDocument: mockDocument,
    };
  });

  test("should return the window from element.ownerDocument.defaultView", () => {
    const result = getOwningGlobalThis(mockElement);
    expect(result).toBe(mockWindow);
  });

  test("should return window when element is null", () => {
    const result = getOwningGlobalThis(null);
    expect(result).toBe(window);
  });

  test("should return window when element.ownerDocument is null", () => {
    mockElement.ownerDocument = null;
    const result = getOwningGlobalThis(mockElement);
    expect(result).toBe(window);
  });

  test("should return window when element.ownerDocument.defaultView is null", () => {
    mockDocument.defaultView = null;
    const result = getOwningGlobalThis(mockElement);
    expect(result).toBe(window);
  });

  test("should handle undefined element", () => {
    const result = getOwningGlobalThis(undefined);
    expect(result).toBe(window);
  });

  test("should handle element without ownerDocument property", () => {
    const elementWithoutDoc = {};
    const result = getOwningGlobalThis(elementWithoutDoc);
    expect(result).toBe(window);
  });
});
