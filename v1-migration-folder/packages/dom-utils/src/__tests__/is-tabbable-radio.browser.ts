import { afterEach, describe, expect, test } from "vitest";
import { isTabbableRadio } from "../is-tabbable-radio";

describe("isTabbableRadio", () => {
  afterEach(() => {
    document.body.innerHTML = "";

    // Restore CSS.escape if we override it
    if (!window.CSS?.escape && "originalEscape" in window) {
      Object.defineProperty(window.CSS, "escape", {
        value: (window as any).originalEscape,
        configurable: true,
      });
      delete (window as any).originalEscape;
    }
  });

  test("returns false when querySelectorAll fails due to invalid name and missing CSS.escape", () => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "foo]"; // Invalid CSS selector

    document.body.appendChild(radio);

    // Remove CSS.escape
    if (window.CSS) {
      (window as any).originalEscape = window.CSS.escape;
      // @ts-expect-error override for test
      delete window.CSS.escape;
    }

    expect(isTabbableRadio(radio)).toBe(true);
  });

  test("returns true for radio in shadow DOM without a form", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "group-shadow";

    shadow.appendChild(radio);

    expect(isTabbableRadio(radio)).toBe(true);
  });

  test("returns true for one of multiple radios with same name but no form", () => {
    const radio1 = document.createElement("input");
    radio1.type = "radio";
    radio1.name = "noform";
    radio1.checked = true;

    const radio2 = document.createElement("input");
    radio2.type = "radio";
    radio2.name = "noform";

    document.body.appendChild(radio1);
    document.body.appendChild(radio2);

    expect(isTabbableRadio(radio1)).toBe(true);
    expect(isTabbableRadio(radio2)).toBe(false);
  });

  test("returns true for checked radio in shadow DOM", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });

    const radio1 = document.createElement("input");
    radio1.type = "radio";
    radio1.name = "shadowgroup";
    radio1.checked = true;

    const radio2 = document.createElement("input");
    radio2.type = "radio";
    radio2.name = "shadowgroup";

    shadow.appendChild(radio1);
    shadow.appendChild(radio2);

    expect(isTabbableRadio(radio1)).toBe(true);
    expect(isTabbableRadio(radio2)).toBe(false);
  });

  test("radios with same name in separate shadow roots are independently tabbable", () => {
    const host1 = document.createElement("div");
    const host2 = document.createElement("div");
    document.body.appendChild(host1);
    document.body.appendChild(host2);

    const shadow1 = host1.attachShadow({ mode: "open" });
    const shadow2 = host2.attachShadow({ mode: "open" });

    const radio1 = document.createElement("input");
    radio1.type = "radio";
    radio1.name = "groupX";
    radio1.checked = true;

    const radio2 = document.createElement("input");
    radio2.type = "radio";
    radio2.name = "groupX";

    shadow1.appendChild(radio1);
    shadow2.appendChild(radio2);

    expect(isTabbableRadio(radio1)).toBe(true);
    expect(isTabbableRadio(radio2)).toBe(true); // separate scopes
  });
});
