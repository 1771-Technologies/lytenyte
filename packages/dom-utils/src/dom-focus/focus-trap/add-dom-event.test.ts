import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { wait } from "@1771technologies/js-utils";
import { addDomEvent } from "./add-dom-event.js";

describe("addDomEvent", () => {
  test("Should call the handler when the event fires and stop calling it after the cleanup function is invoked", async () => {
    const fn = vi.fn();
    const rm = addDomEvent(document.body, "click", fn);
    await userEvent.click(document.body);

    await wait();
    expect(fn).toHaveBeenCalledOnce();

    rm();
    await userEvent.click(document.body);
    expect(fn).toHaveBeenCalledOnce();
  });
});
