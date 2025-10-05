import { describe, expect, test, vi } from "vitest";
import { addDomEvent } from "../add-dom-event.js";
import { userEvent } from "@vitest/browser/context";
import { wait } from "@1771technologies/lytenyte-shared";

describe("addDomEvent", () => {
  test("when an event is added it should be possible to for it to be called and removed", async () => {
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
