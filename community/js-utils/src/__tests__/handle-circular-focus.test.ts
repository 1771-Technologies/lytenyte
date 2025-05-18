import { handleCircularFocus } from "../handle-circular-focus.js";

describe("handleCircularFocus", () => {
  let container: HTMLElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let button3: HTMLButtonElement;

  beforeEach(() => {
    container = document.createElement("div");
    button1 = document.createElement("button");
    button2 = document.createElement("button");
    button3 = document.createElement("button");

    button1.textContent = "First";
    button2.textContent = "Middle";
    button3.textContent = "Last";

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);

    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("forwards direction", () => {
    test("wraps to first element when last element is focused", () => {
      button3.focus();
      const result = handleCircularFocus(container, "forwards");

      expect(result).toBe(true);
      expect(document.activeElement).toBe(button1);
    });

    test("does not wrap when middle element is focused", () => {
      button2.focus();
      const result = handleCircularFocus(container, "forwards");

      expect(result).toBe(false);
      expect(document.activeElement).toBe(button2);
    });
  });

  describe("backwards direction", () => {
    test("wraps to last element when first element is focused", () => {
      button1.focus();
      const result = handleCircularFocus(container, "backwards");

      expect(result).toBe(true);
      expect(document.activeElement).toBe(button3);
    });

    test("does not wrap when middle element is focused", () => {
      button2.focus();
      const result = handleCircularFocus(container, "backwards");

      expect(result).toBe(false);
      expect(document.activeElement).toBe(button2);
    });
  });

  describe("edge cases", () => {
    test("handles container with no focusable elements", () => {
      const emptyContainer = document.createElement("div");
      document.body.appendChild(emptyContainer);

      const result = handleCircularFocus(emptyContainer, "forwards");
      expect(result).toBe(false);

      document.body.removeChild(emptyContainer);
    });

    test("handles when no element is focused", () => {
      document.body.focus(); // Remove focus from any element
      const result = handleCircularFocus(container, "forwards");
      expect(result).toBe(false);
    });

    test("handles when focus is outside container", () => {
      const outsideButton = document.createElement("button");
      document.body.appendChild(outsideButton);
      outsideButton.focus();

      const result = handleCircularFocus(container, "forwards");
      expect(result).toBe(false);

      document.body.removeChild(outsideButton);
    });
  });

  describe("tabindex handling", () => {
    test("respects tabindex order when wrapping", () => {
      // Clear container
      container.innerHTML = "";

      // Create elements with specific tab order
      const buttonTab2 = document.createElement("button");
      buttonTab2.setAttribute("tabindex", "2");
      buttonTab2.textContent = "Tab 2";

      const buttonTab1 = document.createElement("button");
      buttonTab1.setAttribute("tabindex", "1");
      buttonTab1.textContent = "Tab 1";

      const buttonNoTab = document.createElement("button");
      buttonNoTab.textContent = "No Tab";

      container.appendChild(buttonTab2);
      container.appendChild(buttonTab1);
      container.appendChild(buttonNoTab);

      // Test forwards wrapping
      buttonNoTab.focus();
      let result = handleCircularFocus(container, "forwards");
      expect(result).toBe(true);
      expect(document.activeElement).toBe(buttonTab1);

      // Test backwards wrapping
      buttonTab1.focus();
      result = handleCircularFocus(container, "backwards");
      expect(result).toBe(true);
      expect(document.activeElement).toBe(buttonNoTab);
    });
  });
});
