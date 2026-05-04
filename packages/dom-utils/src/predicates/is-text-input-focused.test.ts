import { describe, expect, test, vi } from "vitest";
import { isTextInputFocused } from "./is-text-input-focused.js";
import { wait } from "@1771technologies/js-utils";

describe("isTextInputFocused", () => {
  test("Should return the correct value when a text input is focused", async () => {
    const input = document.createElement("input");

    expect(isTextInputFocused()).toEqual(false);

    document.body.appendChild(input);
    input.focus();
    await expect.element(input).toHaveFocus();

    expect(isTextInputFocused()).toEqual(true);

    input.readOnly = true;
    await wait();
    expect(isTextInputFocused()).toEqual(false);
    input.readOnly = false;

    vi.spyOn(document, "activeElement", "get").mockImplementationOnce(() => null);
    expect(isTextInputFocused()).toEqual(false);

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
    await expect.element(textarea).toHaveFocus();
    expect(isTextInputFocused()).toEqual(true);
  });
});
