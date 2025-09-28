import { page } from "@vitest/browser/context";
import { describe, expect, test } from "vitest";
import { getActiveElement } from "../get-active-element.js";
import { wait } from "@1771technologies/lytenyte-js-utils";

describe("getActiveElement", () => {
  test("When the active element is in the document it should be returned", async () => {
    const button = document.createElement("button");
    button.innerText = "Click me";
    document.body.appendChild(button);

    button.focus();
    await expect.element(page.getByText("Click me")).toHaveFocus();

    expect(getActiveElement(document)).toBe(button);
  });

  test("When the active element is in a shadow root it should be returned", async () => {
    const host = document.createElement("host");
    host.innerText = "some text";
    document.body.appendChild(host);

    host.tabIndex = 0;
    host.focus();

    await wait();
    expect(getActiveElement(document)).toBe(host);
  });

  test("When the focused element is within the shadow root", async () => {
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
