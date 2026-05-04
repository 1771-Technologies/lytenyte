/*
Copyright 2026 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
