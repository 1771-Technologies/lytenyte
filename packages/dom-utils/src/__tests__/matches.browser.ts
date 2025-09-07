import { expect, test, afterEach, describe } from "vitest";

let matches: (this: Element, selector: string) => boolean;

const originalMatches = Element.prototype.matches;
const originalMSMatches = Element.prototype.msMatchesSelector;
const originalWebkitMatches = Element.prototype.webkitMatchesSelector;

describe("matches", () => {
  afterEach(() => {
    // Restore the original state
    Element.prototype.matches = originalMatches;
    Element.prototype.msMatchesSelector = originalMSMatches;
    Element.prototype.webkitMatchesSelector = originalWebkitMatches;
  });

  /**
   * Dynamically reload the module after modifying Element.prototype.
   * This ensures we get the correct fallback logic evaluated at import time.
   */
  async function reloadMatches() {
    const mod = await import("../matches.js");
    matches = mod.matches;
  }

  test("uses Element.prototype.matches if available", async () => {
    Element.prototype.matches = function (selector: string) {
      return selector === "div";
    };
    Element.prototype.msMatchesSelector = undefined!;
    Element.prototype.webkitMatchesSelector = undefined!;

    await reloadMatches();

    const el = document.createElement("div");
    expect(matches.call(el, "div")).toBe(true);
    expect(matches.call(el, "span")).toBe(false);
  });

  test("uses Element.prototype.msMatchesSelector if matches is undefined", async () => {
    Element.prototype.matches = undefined!;
    Element.prototype.msMatchesSelector = function (selector: string) {
      return selector === "div";
    };
    Element.prototype.webkitMatchesSelector = undefined!;

    await reloadMatches();

    const el = document.createElement("div");
    expect(matches.call(el, "div")).toBe(true);
    expect(matches.call(el, "span")).toBe(false);
  });

  test("uses Element.prototype.webkitMatchesSelector if others are undefined", async () => {
    Element.prototype.matches = undefined!;
    Element.prototype.msMatchesSelector = undefined!;
    Element.prototype.webkitMatchesSelector = function (selector: string) {
      return selector === "div";
    };

    await reloadMatches();

    const el = document.createElement("div");
    expect(matches.call(el, "div")).toBe(true);
    expect(matches.call(el, "span")).toBe(false);
  });
});
