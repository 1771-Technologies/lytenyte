import { describe, expect, beforeEach, vi } from "vitest";
import { getFocusableElements } from "../get-focusable-elements";

describe("getFocusableElements", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    // Reset the container before each test
    container = document.createElement("div");
    // Mock getComputedStyle
    vi.spyOn(window, "getComputedStyle").mockImplementation(
      () => ({ display: "block", visibility: "visible" }) as CSSStyleDeclaration,
    );
  });

  test("should find basic focusable elements", () => {
    container.innerHTML = `
      <button>Click me</button>
      <a href="#">Link</a>
      <input type="text" />
      <select><option>Option</option></select>
      <textarea></textarea>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(5);
    expect(elements[0].tagName.toLowerCase()).toBe("button");
    expect(elements[1].tagName.toLowerCase()).toBe("a");
    expect(elements[2].tagName.toLowerCase()).toBe("input");
    expect(elements[3].tagName.toLowerCase()).toBe("select");
    expect(elements[4].tagName.toLowerCase()).toBe("textarea");
  });

  test("should ignore disabled elements", () => {
    container.innerHTML = `
      <button disabled>Disabled button</button>
      <input type="text" disabled />
      <select disabled><option>Option</option></select>
      <textarea disabled></textarea>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(0);
  });

  test("should find elements with tabindex", () => {
    container.innerHTML = `
      <div tabindex="0">Focusable div</div>
      <span tabindex="1">Focusable span</span>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(2);
    expect(elements[0].tagName.toLowerCase()).toBe("span"); // tabindex=1 comes first
    expect(elements[1].tagName.toLowerCase()).toBe("div"); // tabindex=0 comes second
  });

  test("should ignore elements with negative tabindex by default", () => {
    container.innerHTML = `
      <div tabindex="-1">Not focusable</div>
      <div tabindex="-2">Also not focusable</div>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(0);
  });

  test("should ignore elements with invalid tabindex", () => {
    container.innerHTML = `
      <div tabindex="invalid">Not focusable</div>
      <div tabindex="abc">Not focusable</div>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(0);
  });

  test("should ignore hidden elements", () => {
    container.innerHTML = `
      <button hidden>Hidden button</button>
      <a href="#" hidden>Hidden link</a>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(0);
  });

  test("should ignore elements with display: none", () => {
    container.innerHTML = `
      <button>Hidden button</button>
    `;

    vi.spyOn(window, "getComputedStyle").mockImplementation(
      () => ({ display: "none", visibility: "visible" }) as CSSStyleDeclaration,
    );

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(0);
  });

  test("should ignore elements with visibility: hidden", () => {
    container.innerHTML = `
      <button>Invisible button</button>
    `;

    vi.spyOn(window, "getComputedStyle").mockImplementation(
      () => ({ display: "block", visibility: "hidden" }) as CSSStyleDeclaration,
    );

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(0);
  });

  test("should find contenteditable elements", () => {
    container.innerHTML = `
      <div contenteditable>Editable content</div>
      <div contenteditable="true">Also editable</div>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(2);
    elements.forEach((el) => {
      expect(el.hasAttribute("contenteditable")).toBe(true);
    });
  });

  test("should find media controls", () => {
    container.innerHTML = `
      <audio controls></audio>
      <video controls></video>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(2);
    expect(elements[0].tagName.toLowerCase()).toBe("audio");
    expect(elements[1].tagName.toLowerCase()).toBe("video");
  });

  test("should sort elements by tabindex correctly", () => {
    container.innerHTML = `
      <button tabindex="2">Second</button>
      <button tabindex="1">First</button>
      <button tabindex="0">Fourth</button>
      <button>Fifth</button>
      <button tabindex="3">Third</button>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(5);
    expect(elements[0].getAttribute("tabindex")).toBe("1");
    expect(elements[1].getAttribute("tabindex")).toBe("2");
    expect(elements[2].getAttribute("tabindex")).toBe("3");
    expect(elements[3].getAttribute("tabindex")).toBe("0");
    expect(elements[4].getAttribute("tabindex")).toBe(null);
  });

  test("should find nested focusable elements", () => {
    container.innerHTML = `
      <div>
        <button>Nested button</button>
        <div>
          <a href="#">Deeply nested link</a>
        </div>
      </div>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(2);
    expect(elements[0].tagName.toLowerCase()).toBe("button");
    expect(elements[1].tagName.toLowerCase()).toBe("a");
  });

  test("should include elements with negative tabindex when allowNegativeTabIndex is true", () => {
    container.innerHTML = `
      <div tabindex="-1">Should be focusable</div>
      <div tabindex="-2">Also focusable</div>
      <button>Regular button</button>
    `;

    const elements = getFocusableElements(container, true);
    expect(elements).toHaveLength(3);
    expect(elements[0].getAttribute("tabindex")).toBe("-1");
    expect(elements[1].getAttribute("tabindex")).toBe("-2");
    expect(elements[2].tagName.toLowerCase()).toBe("button");
  });

  test("should handle empty container", () => {
    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(0);
  });

  test("should find details summary elements", () => {
    container.innerHTML = `
      <details>
        <summary>Details summary</summary>
        <p>Details content</p>
      </details>
    `;

    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(1);
    expect(elements[0].tagName.toLowerCase()).toBe("summary");
  });
});
