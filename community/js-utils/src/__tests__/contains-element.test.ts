import { containsElement } from "../contains-element.js";

describe("containsElement", () => {
  let parent: HTMLElement;
  let child: HTMLElement;
  let grandchild: HTMLElement;

  beforeEach(() => {
    // Setup fresh elements for each test
    parent = document.createElement("div");
    child = document.createElement("div");
    grandchild = document.createElement("div");

    // Create basic DOM structure
    parent.appendChild(child);
    child.appendChild(grandchild);
  });

  describe("basic element containment", () => {
    test("returns true for direct child element", () => {
      expect(containsElement(parent, child)).toBe(true);
    });

    test("returns true for nested grandchild element", () => {
      expect(containsElement(parent, grandchild)).toBe(true);
    });

    test("returns true for self-reference", () => {
      expect(containsElement(parent, parent)).toBe(true);
    });

    test("returns false for unrelated element", () => {
      const outsideElement = document.createElement("div");
      expect(containsElement(parent, outsideElement)).toBe(false);
    });
  });

  describe("special node types", () => {
    test("handles text nodes", () => {
      const textNode = document.createTextNode("test content");
      child.appendChild(textNode);
      expect(containsElement(parent, textNode)).toBe(true);
    });

    test("handles comment nodes", () => {
      const commentNode = document.createComment("test comment");
      child.appendChild(commentNode);
      expect(containsElement(parent, commentNode)).toBe(true);
    });

    test("handles document fragments", () => {
      const fragment = document.createDocumentFragment();
      const fragmentChild = document.createElement("span");
      fragment.appendChild(fragmentChild);
      child.appendChild(fragment);
      // The fragment itself is not contained (it's just a container)
      // but its children are now part of the DOM
      expect(containsElement(parent, fragmentChild)).toBe(true);
    });

    test("handles processing instruction nodes", () => {
      const pi = document.createProcessingInstruction("xml-stylesheet", 'href="style.css"');
      child.appendChild(pi);
      expect(containsElement(parent, pi)).toBe(true);
    });
  });

  describe("shadow DOM", () => {
    test("handles shadow root host element", () => {
      const shadowHost = document.createElement("div");
      parent.appendChild(shadowHost);
      shadowHost.attachShadow({ mode: "open" });
      expect(containsElement(parent, shadowHost)).toBe(true);
    });

    test("handles elements within shadow DOM", () => {
      const shadowHost = document.createElement("div");
      const shadowRoot = shadowHost.attachShadow({ mode: "open" });
      const shadowChild = document.createElement("div");
      shadowRoot.appendChild(shadowChild);
      parent.appendChild(shadowHost);

      // Parent contains the shadow host, but not the shadow child
      expect(containsElement(parent, shadowHost)).toBe(true);
      expect(containsElement(parent, shadowChild)).toBe(false);

      // Shadow host contains the shadow child
      expect(containsElement(shadowHost, shadowChild)).toBe(true);
    });

    test("handles nested shadow DOM elements", () => {
      const shadowHost = document.createElement("div");
      const shadowRoot = shadowHost.attachShadow({ mode: "open" });
      const shadowChild = document.createElement("div");
      const shadowGrandchild = document.createElement("div");

      shadowRoot.appendChild(shadowChild);
      shadowChild.appendChild(shadowGrandchild);

      // Shadow host contains both child and grandchild
      expect(containsElement(shadowHost, shadowChild)).toBe(true);
      expect(containsElement(shadowHost, shadowGrandchild)).toBe(true);
    });
  });

  describe("edge cases", () => {
    test("handles null target", () => {
      expect(containsElement(parent, null)).toBe(false);
    });

    test("handles null parent", () => {
      expect(containsElement(null as any, child)).toBe(false);
    });

    test("handles non-Node EventTarget", () => {
      const eventTarget = new EventTarget();
      expect(containsElement(parent, eventTarget)).toBe(false);
    });

    test("handles detached nodes", () => {
      const detachedParent = document.createElement("div");
      const detachedChild = document.createElement("div");
      detachedParent.appendChild(detachedChild);
      expect(containsElement(detachedParent, detachedChild)).toBe(true);
    });
  });

  describe("containsElement with excludeSelf option", () => {
    let parent: HTMLElement;
    let child: HTMLElement;
    let grandchild: HTMLElement;

    beforeEach(() => {
      parent = document.createElement("div");
      child = document.createElement("div");
      grandchild = document.createElement("div");
      parent.appendChild(child);
      child.appendChild(grandchild);
    });

    describe("with default options", () => {
      test("returns true for self-reference", () => {
        expect(containsElement(parent, parent)).toBe(true);
      });

      test("returns true for child", () => {
        expect(containsElement(parent, child)).toBe(true);
      });
    });

    describe("with excludeSelf: true", () => {
      test("returns false for self-reference", () => {
        expect(containsElement(parent, parent, { excludeSelf: true })).toBe(false);
      });

      test("returns true for child", () => {
        expect(containsElement(parent, child, { excludeSelf: true })).toBe(true);
      });

      test("returns true for grandchild", () => {
        expect(containsElement(parent, grandchild, { excludeSelf: true })).toBe(true);
      });
    });

    describe("shadow DOM with excludeSelf", () => {
      test("handles shadow DOM elements with excludeSelf", () => {
        const shadowHost = document.createElement("div");
        const shadowRoot = shadowHost.attachShadow({ mode: "open" });
        const shadowChild = document.createElement("div");
        shadowRoot.appendChild(shadowChild);
        parent.appendChild(shadowHost);

        expect(containsElement(shadowHost, shadowHost, { excludeSelf: true })).toBe(false);
        expect(containsElement(shadowHost, shadowChild, { excludeSelf: true })).toBe(true);
      });
    });
  });
});
