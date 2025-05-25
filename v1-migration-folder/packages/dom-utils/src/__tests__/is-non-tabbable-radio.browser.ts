import { afterEach, describe, expect, test } from "vitest";
import { isNonTabbableRadio } from "../is-non-tabbable-radio.js";

describe("isNonTabbableRadio", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("returns false for non-radio elements", () => {
    const input = document.createElement("input");
    input.type = "text";
    document.body.appendChild(input);

    expect(isNonTabbableRadio(input)).toBe(false);
  });

  test("returns true for an unchecked radio in a group with a checked radio", () => {
    const radio1 = document.createElement("input");
    radio1.type = "radio";
    radio1.name = "group1";
    radio1.checked = true;

    const radio2 = document.createElement("input");
    radio2.type = "radio";
    radio2.name = "group1";

    document.body.appendChild(radio1);
    document.body.appendChild(radio2);

    expect(isNonTabbableRadio(radio1)).toBe(false); // checked, tabbable
    expect(isNonTabbableRadio(radio2)).toBe(true); // not tabbable
  });

  test("returns false for radio with no name", () => {
    const radio = document.createElement("input");
    radio.type = "radio";
    document.body.appendChild(radio);

    expect(isNonTabbableRadio(radio)).toBe(false); // tabbable by default
  });

  test("returns false for single radio in group (no checked)", () => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "group2";
    document.body.appendChild(radio);

    expect(isNonTabbableRadio(radio)).toBe(false);
  });

  test("returns false for checked radio", () => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "group3";
    radio.checked = true;
    document.body.appendChild(radio);

    expect(isNonTabbableRadio(radio)).toBe(false);
  });
});
