import { userEvent } from "@vitest/browser/context";
import { describe, expect, test } from "vitest";
import { handleSkipInner } from "../handle-skip-inner.js";
import { render } from "vitest-browser-react";

describe("handleSkipInner", () => {
  test("should behave correctly", async () => {
    render(
      <div id="x">
        <button>B</button>
        <div tabIndex={0} onKeyDown={handleSkipInner}>
          <button>A</button>
          <button>A</button>
          <button>A</button>
          <button>A</button>
        </div>
        <button>C</button>
      </div>,
    );

    const el = document.getElementById("x")!;

    const buttonA = el.firstElementChild as HTMLElement;
    const div = buttonA.nextElementSibling as HTMLElement;
    const buttonB = el.lastElementChild as HTMLElement;

    div.addEventListener("keydown", handleSkipInner as any);

    document.body.appendChild(el);

    await userEvent.click(buttonA);
    await expect.element(buttonA).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(div).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(buttonB).toHaveFocus();
  });
});
