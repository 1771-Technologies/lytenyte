import { getFocusableBoundary } from "../get-focusable-boundary.js";

describe("getFocusableBoundary", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("tabindex handling", () => {
    test("handles positive tabindex ordering", () => {
      container.innerHTML = `
        <button tabindex="2">Second</button>
        <button tabindex="1">First</button>
        <button>Natural</button>
        <input type="text" tabindex="3" value="Third" />
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("First");
      expect(last?.tagName).toBe("BUTTON");
      expect(last?.textContent).toBe("Natural");
    });

    test("handles negative tabindex values", () => {
      container.innerHTML = `
        <button tabindex="-1">Negative One</button>
        <button tabindex="-2">Negative Two</button>
        <button>Natural</button>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("Natural");
      expect(last?.textContent).toBe("Natural");
    });

    test("handles mix of negative, zero, and positive tabindex", () => {
      container.innerHTML = `
        <button tabindex="-1">Skip</button>
        <button tabindex="2">Second</button>
        <button tabindex="1">First</button>
        <button tabindex="0">Zero</button>
        <button>Natural</button>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("First");
      expect(last?.textContent).toBe("Natural");
    });
  });

  describe("disabled attribute handling", () => {
    test("when disabled attribute exists", () => {
      container.innerHTML = `
        <button disabled>Disabled button</button>
        <button>Enabled button</button>
      `;

      const { first } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("Enabled button");
    });

    test("when disabled attribute does not exist", () => {
      container.innerHTML = `
        <button>First button</button>
        <button>Second button</button>
      `;

      const { first } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("First button");
    });

    test("mixed disabled states", () => {
      container.innerHTML = `
        <button disabled>First (disabled)</button>
        <button>Second (enabled)</button>
        <button disabled>Third (disabled)</button>
        <button>Fourth (enabled)</button>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("Second (enabled)");
      expect(last?.textContent).toBe("Fourth (enabled)");
    });
  });

  describe("hidden attribute handling", () => {
    test("when hidden attribute exists", () => {
      container.innerHTML = `
        <button hidden>Hidden button</button>
        <button>Visible button</button>
      `;

      const { first } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("Visible button");
    });

    test("when hidden attribute does not exist", () => {
      container.innerHTML = `
        <button>First button</button>
        <button>Second button</button>
      `;

      const { first } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("First button");
    });

    test("mixed hidden states", () => {
      container.innerHTML = `
        <button hidden>First (hidden)</button>
        <button>Second (visible)</button>
        <button hidden>Third (hidden)</button>
        <button>Fourth (visible)</button>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("Second (visible)");
      expect(last?.textContent).toBe("Fourth (visible)");
    });
  });
  describe("disabled attribute check", () => {
    test("element WITH disabled attribute is not focusable", () => {
      // hasAttribute("disabled") returns true
      container.innerHTML = "<button disabled>Disabled</button>";
      const { first, last } = getFocusableBoundary(container);
      expect(first).toBeNull();
      expect(last).toBeNull();
    });

    test("element WITHOUT disabled attribute is focusable", () => {
      // hasAttribute("disabled") returns false
      container.innerHTML = "<button>Enabled</button>";
      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("Enabled");
      expect(last?.textContent).toBe("Enabled");
    });

    test("verify both paths in same test", () => {
      container.innerHTML = `
      <button disabled>First (disabled)</button>
      <button>Second (enabled)</button>
    `;

      const { first } = getFocusableBoundary(container);

      // First button has disabled attribute (true branch)
      expect(container.querySelector("button")?.hasAttribute("disabled")).toBe(true);
      expect(first?.textContent).not.toBe("First (disabled)");

      // Second button doesn't have disabled attribute (false branch)
      expect(container.querySelectorAll("button")[1]?.hasAttribute("disabled")).toBe(false);
      expect(first?.textContent).toBe("Second (enabled)");
    });
  });

  describe("combined attribute tests", () => {
    test("all combinations of hidden and disabled", () => {
      container.innerHTML = `
        <button>Normal button</button>
        <button hidden>Hidden button</button>
        <button disabled>Disabled button</button>
        <button hidden disabled>Hidden and disabled button</button>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("Normal button");
      expect(last?.textContent).toBe("Normal button");
    });

    test("removing attributes makes elements focusable", () => {
      container.innerHTML = `
        <button id="btn1" hidden>First</button>
        <button id="btn2" disabled>Second</button>
      `;

      expect(getFocusableBoundary(container).first).toBeNull();

      const btn1 = container.querySelector("#btn1") as HTMLButtonElement;
      btn1.removeAttribute("hidden");
      expect(getFocusableBoundary(container).first?.textContent).toBe("First");

      const btn2 = container.querySelector("#btn2") as HTMLButtonElement;
      btn2.removeAttribute("disabled");

      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("First");
      expect(last?.textContent).toBe("Second");
    });

    test("adding attributes makes elements unfocusable", () => {
      container.innerHTML = `
        <button id="btn1">First</button>
        <button id="btn2">Second</button>
      `;

      const initial = getFocusableBoundary(container);
      expect(initial.first?.textContent).toBe("First");
      expect(initial.last?.textContent).toBe("Second");

      const btn1 = container.querySelector("#btn1") as HTMLButtonElement;
      btn1.setAttribute("hidden", "");
      expect(getFocusableBoundary(container).first?.textContent).toBe("Second");

      const btn2 = container.querySelector("#btn2") as HTMLButtonElement;
      btn2.setAttribute("disabled", "");

      const { first, last } = getFocusableBoundary(container);
      expect(first).toBeNull();
      expect(last).toBeNull();
    });
  });

  describe("focusable element types", () => {
    test("handles various focusable element types", () => {
      container.innerHTML = `
        <input type="text">
        <button>Button</button>
        <select><option>Option</option></select>
        <textarea></textarea>
        <a href="#">Link</a>
        <div tabindex="0">Div</div>
        <audio controls>Audio</audio>
        <video controls>Video</video>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.tagName).toBe("INPUT");
      expect(last?.tagName).toBe("VIDEO");
    });

    test("handles contenteditable elements", () => {
      container.innerHTML = `
        <div contenteditable>Editable div</div>
        <p contenteditable="true">Editable paragraph</p>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.tagName).toBe("DIV");
      expect(last?.tagName).toBe("P");
    });
  });

  describe("edge cases", () => {
    test("handles empty container", () => {
      const { first, last } = getFocusableBoundary(container);
      expect(first).toBeNull();
      expect(last).toBeNull();
    });

    test("handles container with only unfocusable elements", () => {
      container.innerHTML = `
        <div>Regular div</div>
        <p>Paragraph</p>
        <span>Span</span>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first).toBeNull();
      expect(last).toBeNull();
    });

    test("handles display: none elements", () => {
      container.innerHTML = `
        <button style="display: none;">Hidden</button>
        <button>Visible</button>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("Visible");
      expect(last?.textContent).toBe("Visible");
    });

    test("handles visibility: hidden elements", () => {
      container.innerHTML = `
        <button style="visibility: hidden;">Hidden</button>
        <button>Visible</button>
      `;

      const { first, last } = getFocusableBoundary(container);
      expect(first?.textContent).toBe("Visible");
      expect(last?.textContent).toBe("Visible");
    });
  });
});
