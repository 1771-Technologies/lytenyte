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

import { page } from "vitest/browser";
import { describe, expect, test } from "vitest";
import { getActiveElement } from "./get-active-element.js";
import { wait } from "@1771technologies/js-utils";

describe("getActiveElement", () => {
  test("Should return the focused element from the document", async () => {
    const button = document.createElement("button");
    button.innerText = "Click me";
    document.body.appendChild(button);

    button.focus();
    await expect.element(page.getByText("Click me")).toHaveFocus();

    expect(getActiveElement(document)).toBe(button);
  });

  test("Should return the focused element from a shadow root", async () => {
    const host = document.createElement("host");
    host.innerText = "some text";
    document.body.appendChild(host);

    host.tabIndex = 0;
    host.focus();

    await wait();
    expect(getActiveElement(document)).toBe(host);
  });

  test("Should return the deepest focused element when nested inside shadow roots", async () => {
    const nestedHost = document.createElement("div");
    const outer = nestedHost.attachShadow({ mode: "open" });
    const innerHost = document.createElement("div");
    innerHost.attachShadow({ mode: "open" }).innerHTML = `<input id="x" data-testid="x" />`;
    outer.appendChild(innerHost);
    document.body.appendChild(nestedHost);

    const deep = innerHost!.shadowRoot!.getElementById("x")!;
    deep?.focus();
    await wait();
    expect(getActiveElement(document)).toBe(deep);
    expect(getActiveElement(innerHost.shadowRoot!)).toBe(deep);

    deep.blur();
    await wait();
    expect(getActiveElement(innerHost.shadowRoot!)).toEqual(null);
  });
});
