import { describe, expect, test } from "vitest";
import { isRadio } from "../is-radio";

// Simulate minimal implementation of isInput (assumed imported by isRadio)
function createInput(type: string): HTMLInputElement {
  const input = document.createElement("input");
  input.type = type;
  return input;
}

describe("isRadio", () => {
  test("returns true for input of type 'radio'", () => {
    const radio = createInput("radio");
    expect(isRadio(radio)).toBe(true);
  });

  test("returns false for input of other types", () => {
    const textInput = createInput("text");
    const checkboxInput = createInput("checkbox");
    const submitInput = createInput("submit");

    expect(isRadio(textInput)).toBe(false);
    expect(isRadio(checkboxInput)).toBe(false);
    expect(isRadio(submitInput)).toBe(false);
  });

  test("returns false for non-input elements", () => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    const button = document.createElement("button");

    expect(isRadio(div)).toBe(false);
    expect(isRadio(span)).toBe(false);
    expect(isRadio(button)).toBe(false);
  });
});
