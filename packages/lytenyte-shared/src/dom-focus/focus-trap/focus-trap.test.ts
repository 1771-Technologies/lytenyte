import { describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { FocusTrap } from "./focus-trap.js";
import { wait } from "@1771technologies/js-utils";

describe("FocusTrap", () => {
  test("Should trap focus within the container", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(button3);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {});
    expect(trap.active).toEqual(false);
    trap.activate();
    expect(trap.active).toEqual(true);

    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button3).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should prevent focus from moving outside the container", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.append(div);
    document.body.append(button3);

    const trap = new FocusTrap(div, {});
    trap.activate();

    await expect.element(button1).toHaveFocus();
    button3.focus();
    await wait();
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
    await wait();
    button3.focus();
    await expect.element(button3).toHaveFocus();
  });

  test("Should include newly added elements in the tab order", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {});
    trap.activate();

    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();
    div.appendChild(button3);
    await userEvent.keyboard("{Tab}");
    await expect.element(button3).toHaveFocus();

    trap.deactivate();
  });

  test("Should refocus when the active element is removed", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {});
    trap.activate();

    await expect.element(button1).toHaveFocus();

    button1.remove();

    await expect.element(button2).toHaveFocus();

    trap.deactivate();
  });

  test("Should focus the specified initial node on activation", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(button3);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { initialFocus: button3 });
    trap.activate();

    await expect.element(button3).toHaveFocus();

    trap.deactivate();
  });

  test("Should return focus to the previously focused element on deactivation", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    const trap = new FocusTrap(div, { returnFocusOnDeactivate: true });

    button3.focus();
    await expect.element(button3).toHaveFocus();

    trap.activate();
    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();

    trap.deactivate();
    await expect.element(button3).toHaveFocus();
  });

  test("Should not return focus on deactivation when returnFocusOnDeactivate is false", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    const trap = new FocusTrap(div, { returnFocusOnDeactivate: false });

    button3.focus();
    await expect.element(button3).toHaveFocus();

    trap.activate();
    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();

    trap.deactivate();
    await expect.element(button2).toHaveFocus();
  });

  test("Should return focus to the element specified by setReturnFocus", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    const trap = new FocusTrap(div, { setReturnFocus: () => button3 });

    trap.activate();
    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();

    trap.deactivate();
    await expect.element(button3).toHaveFocus();
  });

  test("Should not move focus on deactivation when setReturnFocus returns false", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    const trap = new FocusTrap(div, { setReturnFocus: () => false });

    trap.activate();
    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();

    trap.deactivate();
    await expect.element(button2).toHaveFocus();
  });

  test("Should allow clicks outside the container when allowOutsideClick is true", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    const click = vi.fn();
    button3.onclick = click;

    const trap = new FocusTrap(div, { allowOutsideClick: true });

    trap.activate();
    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();

    await userEvent.click(button3);

    expect(click).toHaveBeenCalledOnce();

    trap.deactivate();
  });

  test("Should prevent clicks outside the container when allowOutsideClick is false", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    const click = vi.fn();
    button3.onclick = click;

    const trap = new FocusTrap(div, { allowOutsideClick: false });

    trap.activate();
    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();

    await userEvent.click(button3);

    expect(click).toHaveBeenCalledTimes(0);

    trap.deactivate();
  });

  test("Should support nested focus traps", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");

    const div2 = document.createElement("div");
    const button3 = document.createElement("input");
    const button4 = document.createElement("input");
    div2.appendChild(button3);
    div2.appendChild(button4);

    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(div2);

    document.body.appendChild(div);
    const trap = new FocusTrap(div, {});
    trap.activate();

    await expect.element(button1).toHaveFocus();
    const nestedTrap = new FocusTrap(div2, {});

    nestedTrap.activate();
    await expect.element(button3).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button4).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button3).toHaveFocus();
    nestedTrap.deactivate();
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should trap focus across multiple containers", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");

    const div2 = document.createElement("div");
    const button3 = document.createElement("input");
    const button4 = document.createElement("input");
    div2.appendChild(button3);
    div2.appendChild(button4);

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(div2);

    const trap = new FocusTrap([div, div2], {});
    trap.activate();

    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button3).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button4).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should support pausing and unpausing", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    const trap = new FocusTrap(div, {});

    trap.activate();

    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button1).toHaveFocus();
    trap.pause();
    expect(trap.paused).toEqual(true);
    trap.pause();
    expect(trap.paused).toEqual(true);
    await userEvent.keyboard("{Tab}");
    await expect.element(button2).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button3).toHaveFocus();
    trap.unpause();
    expect(trap.paused).toEqual(false);
    trap.unpause();
    expect(trap.paused).toEqual(false);
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should deactivate gracefully when the trap stack is empty", () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    const trapStack: any[] = [];
    const trap = new FocusTrap(div, { trapStack: trapStack });
    trap.activate();

    expect(trapStack).toEqual([trap]);
    trapStack.pop();

    trap.deactivate();
    trap.deactivate();
  });

  test("Should call all lifecycle listeners at the appropriate times", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");

    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(button3);

    document.body.appendChild(div);

    const onActivate = vi.fn();
    const onDeactivate = vi.fn();
    const onPause = vi.fn();
    const onPostActivate = vi.fn();
    const onPostDeactivate = vi.fn();
    const onPostPause = vi.fn();
    const onPostUnpause = vi.fn();
    const onUnpause = vi.fn();

    const trap = new FocusTrap(div, {
      onActivate,
      onDeactivate,
      onPause,
      onPostActivate,
      onPostDeactivate,
      onPostPause,
      onPostUnpause,
      onUnpause,
    });

    trap.activate();
    expect(onActivate).toHaveBeenCalledOnce();
    expect(onPostActivate).toHaveBeenCalledOnce();
    trap.pause();
    expect(onPause).toHaveBeenCalledOnce();
    expect(onPostPause).toHaveBeenCalledOnce();
    trap.unpause();
    expect(onUnpause).toHaveBeenCalledOnce();
    expect(onPostUnpause).toHaveBeenCalledOnce();
    trap.deactivate();
    await wait();
    expect(onDeactivate).toHaveBeenCalledOnce();
    expect(onPostDeactivate).toHaveBeenCalledOnce();

    trap.deactivate();
  });

  test("Should not add or remove listeners after deactivation", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    await wait();

    const trap = new FocusTrap(div, {});
    trap.activate();
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should wait for checkCanReturnFocus to resolve before returning focus", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    document.body.appendChild(button3);

    await wait();

    const trap = new FocusTrap(div, {
      setReturnFocus: () => button3,
      checkCanReturnFocus: () => new Promise((res) => setTimeout(res, 0)),
    });

    trap.activate();
    await expect.element(button1).toHaveFocus();
    trap.deactivate();
    await expect.element(button3).toHaveFocus();
  });

  test("Should throw when there are no tabbable nodes and no fallback is provided", () => {
    const div = document.createElement("div");

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {});

    expect(() => trap.activate()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Your focus-trap must have at least one container with at least one tabbable node in it at all times]`,
    );
  });

  test("Should throw when multiple containers contain nodes with positive tab indexes", () => {
    const divA = document.createElement("div");
    const divB = document.createElement("div");
    const buttonA = document.createElement("input");
    buttonA.tabIndex = 1;
    const buttonB = document.createElement("input");
    buttonB.tabIndex = 1;

    divA.appendChild(buttonA);
    divB.appendChild(buttonB);

    document.body.appendChild(divA);
    document.body.appendChild(divB);

    const trap = new FocusTrap([divA, divB], {});

    expect(() => trap.activate()).toThrowErrorMatchingInlineSnapshot(
      `[Error: At least one node with a positive tabindex was found in one of your focus-trap's multiple containers. Positive tabindexes are only supported in single-container focus-traps.]`,
    );
  });

  test("Should immediately focus the initial node when delayInitialFocus is false", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {
      delayInitialFocus: false,
    });

    trap.activate();
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should defer activation until checkCanFocusTrap resolves", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    let r!: any;
    const trap = new FocusTrap(div, {
      checkCanFocusTrap: () =>
        new Promise((res) => {
          r = res;
        }),
    });

    trap.activate();
    trap.activate();
    await wait();
    await expect.element(button1).not.toHaveFocus();
    r();
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should move focus to a clicked focusable inside the container", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);
    const trap = new FocusTrap(div, {});

    trap.activate();

    await expect.element(button1).toHaveFocus();
    await userEvent.click(button2);
    await expect.element(button2).toHaveFocus();

    trap.deactivate();
  });

  test("Should deactivate when clickOutsideDeactivates triggers on an outside click", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");

    div.appendChild(button1);

    document.body.appendChild(div);
    document.body.appendChild(button2);

    const fn = vi.fn(() => true);
    const trap = new FocusTrap(div, { clickOutsideDeactivates: () => fn() });
    trap.activate();

    await expect.element(button1).toHaveFocus();

    document.dispatchEvent(new MouseEvent("click", {}));
    expect(fn).toHaveBeenCalledOnce();

    await userEvent.click(button2);
    await expect.element(button2).toHaveFocus();

    trap.deactivate();
  });

  test("Should navigate correctly when the target is focusable but not tabbable", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const div2 = document.createElement("div");
    const button3 = document.createElement("input");
    const button4 = document.createElement("input");
    button4.tabIndex = -1;

    div.appendChild(button1);
    div.appendChild(button2);
    div2.appendChild(button3);
    div2.appendChild(button4);

    document.body.appendChild(div);
    document.body.appendChild(div2);

    const trap = new FocusTrap([div, div2], {});
    trap.activate();
    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    button4.focus();
    await expect.element(button4).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect.element(button3).toHaveFocus();

    trap.deactivate();
  });

  test("Should navigate using custom forward and backward key handlers", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");
    const button3 = document.createElement("input");
    const button4 = document.createElement("input");

    button2.tabIndex = -1;
    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(button3);
    div.appendChild(button4);

    div.tabIndex = 0;
    document.body.appendChild(div);

    const trap = new FocusTrap(div, {
      isKeyForward: (k) => k.key === "l",
      isKeyBackward: (k) => k.key === "h",
    });
    trap.activate();
    await expect.element(button1).toHaveFocus();
    button2.focus();
    await expect.element(button2).toHaveFocus();
    await userEvent.keyboard("{l}");
    await expect.element(button3).toHaveFocus();
    await userEvent.keyboard("{l}");
    await expect.element(button4).toHaveFocus();
    await userEvent.keyboard("{h}");
    await expect.element(button3).toHaveFocus();

    trap.deactivate();
  });

  test("Should select text when focusing a selectable input", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const select = document.createElement("input");

    div.appendChild(select);
    div.appendChild(button1);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {});
    trap.activate();

    await expect.element(select).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should fall back to window when the document has no defaultView", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("input");
    const button2 = document.createElement("input");

    div.appendChild(button1);
    div.appendChild(button2);

    vi.spyOn(document, "defaultView", "get").mockImplementationOnce(() => null);
    document.body.appendChild(div);

    const trap = new FocusTrap(div, {});
    trap.activate();

    await expect.element(button1).toHaveFocus();
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should deactivate when the Escape key is pressed", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("input");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { escapeDeactivates: true });
    trap.activate();

    await expect.element(button1).toHaveFocus();
    await userEvent.keyboard("{Escape}");

    expect(trap.active).toEqual(false);
  });

  test("Should pull focus back into the trap when focus escapes to the document", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const input = document.createElement("input");

    button1.tabIndex = 2;
    div.appendChild(button1);
    div.appendChild(input);

    const other = document.createElement("input");
    vi.spyOn(other, "nodeType", "get").mockImplementation(() => 9);
    const other2 = document.createElement("input");

    document.body.appendChild(div);
    document.body.appendChild(other);
    document.body.appendChild(other2);

    const trap = new FocusTrap(div, {});
    trap.activate();

    await expect.element(button1).toHaveFocus();
    other.focus();
    await expect.element(other).toHaveFocus();
    other2.focus();
    await expect.element(input).toHaveFocus();

    trap.deactivate();
  });

  test("Should pull focus back when the target escapes and tabbable nodes have been cleared", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const input = document.createElement("input");

    button1.tabIndex = 2;
    div.appendChild(button1);
    div.appendChild(input);

    const other = document.createElement("input");
    vi.spyOn(other, "nodeType", "get").mockImplementation(() => 9);
    const other2 = document.createElement("input");

    document.body.appendChild(div);
    document.body.appendChild(other);
    document.body.appendChild(other2);

    const trap = new FocusTrap(div, { delayInitialFocus: false });
    trap.activate();
    await expect.element(button1).toHaveFocus();
    other.focus();
    await expect.element(other).toHaveFocus();
    // @ts-expect-error this is technically fine
    trap.state.containerGroups[0].tabbableNodes = [];
    other2.focus();
    await expect.element(input).toHaveFocus();

    trap.deactivate();
  });

  test("Should pull focus back when the target escapes and tabbable nodes are present", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const input = document.createElement("input");

    button1.tabIndex = 2;
    div.appendChild(button1);
    div.appendChild(input);

    const other = document.createElement("input");
    vi.spyOn(other, "nodeType", "get").mockImplementation(() => 9);
    const other2 = document.createElement("input");

    document.body.appendChild(div);
    document.body.appendChild(other);
    document.body.appendChild(other2);

    const trap = new FocusTrap(div, { delayInitialFocus: false });
    trap.activate();
    await expect.element(button1).toHaveFocus();
    other.focus();
    await expect.element(other).toHaveFocus();
    // @ts-expect-error this is technically fine
    trap.state.containerGroups[0].tabbableNodes = [document.createElement("div")];
    other2.focus();
    await expect.element(input).toHaveFocus();

    trap.deactivate();
  });

  test("Should not auto-focus any element when initialFocus is false", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { initialFocus: false });
    trap.activate();

    await userEvent.keyboard("{Tab}");
    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should fall back to the first tabbable node when the initial focus node is not focusable", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const div2 = document.createElement("div");

    div.appendChild(button1);
    div.appendChild(div2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { initialFocus: div2 });
    trap.activate();

    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should use fallbackFocus when the initial node is not focusable and no tabbable nodes exist", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    const div2 = document.createElement("div");
    button1.tabIndex = -1;
    button2.tabIndex = -1;

    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(div2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { initialFocus: div2, fallbackFocus: button2 });
    trap.activate();

    await expect.element(button2).toHaveFocus();

    trap.deactivate();
  });

  test("Should use fallbackFocus when the initial focus selector matches no node", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    const div2 = document.createElement("div");
    button1.tabIndex = -1;
    button2.tabIndex = -1;

    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(div2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { initialFocus: "#id", fallbackFocus: button2 });
    trap.activate();

    await expect.element(button2).toHaveFocus();

    trap.deactivate();
  });

  test("Should throw when the initial focus selector matches no node and no fallback is defined", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    const div2 = document.createElement("div");

    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(div2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {
      initialFocus: "#id",
      delayInitialFocus: false,
    });
    expect(() => trap.activate()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Your focus-trap needs to have at least one focusable element]`,
    );

    trap.deactivate();
  });

  test("Should throw when setReturnFocus uses an invalid selector on deactivation", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    const div2 = document.createElement("div");

    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(div2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {
      setReturnFocus: "#id",
    });

    trap.activate();
    await expect.element(button1).toHaveFocus();

    vi.useFakeTimers();
    const err = new Promise<any>((res) => {
      try {
        trap.deactivate();
        vi.runAllTimers();
      } catch (e) {
        res(`${e}`);
      }
    });
    await err;

    vi.useRealTimers();
  });

  test("Should use fallbackFocus when the initial focus node is not connected to the DOM", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    button2.tabIndex = -1;

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    vi.spyOn(button1, "isConnected", "get").mockImplementationOnce(() => false);
    const trap = new FocusTrap(div, { fallbackFocus: button2 });
    trap.activate();

    await expect.element(button2).toHaveFocus();

    trap.deactivate();
  });

  test("Should focus the first tabbable node when initialFocus is true", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { initialFocus: true as any });
    trap.activate();

    await expect.element(button1).toHaveFocus();

    trap.deactivate();
  });

  test("Should throw when fallbackFocus is null", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {
      initialFocus: "#id",
      fallbackFocus: null as any,
      delayInitialFocus: false,
    });

    expect(() => trap.activate()).toThrowErrorMatchingInlineSnapshot(
      `[Error: \`fallbackFocus\` was specified but was not a node, or did not return a node]`,
    );

    trap.deactivate();
  });

  test("Should throw when both initialFocus and fallbackFocus selectors match no node", () => {
    const div = document.createElement("div");
    const trap = new FocusTrap(div, { fallbackFocus: "#id", initialFocus: "#id" });
    expect(() => trap.activate()).toThrowErrorMatchingInlineSnapshot(
      `[Error: \`fallbackFocus\` as selector refers to no known node]`,
    );

    trap.deactivate();
  });

  test("Should focus the element matched by the initialFocus selector", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    button2.id = "id";

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { initialFocus: "#id" });
    trap.activate();

    await expect.element(button2).toHaveFocus();

    trap.deactivate();
  });

  test("Should throw when the fallbackFocus selector is malformed", () => {
    const div = document.createElement("div");
    const trap = new FocusTrap(div, { fallbackFocus: "{{" });
    expect(() => trap.activate()).toThrowError("`fallbackFocus` appears to be an invalid selector;");

    trap.deactivate();
  });

  test("Should use per-call options passed to activate", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {});
    const onActivate = vi.fn();
    const onPostActivate = vi.fn();
    let capture!: () => void;
    trap.activate({
      checkCanFocusTrap: () =>
        new Promise<void>((res) => {
          capture = res;
        }),
      onActivate,
      onPostActivate,
    });

    await wait();
    await expect.element(button1).not.toHaveFocus();

    capture();
    await wait();
    await expect.element(button1).toHaveFocus();

    expect(onActivate).toHaveBeenCalledOnce();
    expect(onPostActivate).toHaveBeenCalledOnce();

    trap.deactivate();
  });

  // INTERNALS
  test("Should handle all internal handleFocus branches", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { isKeyForward: () => true });
    trap.activate();

    await expect.element(button1).toHaveFocus();

    // @ts-expect-error this is fine, we are testing some internals
    trap.state.mostRecentlyFocusedNode = null;
    // @ts-expect-error this is fine, we are testing some internals
    trap.handleFocus({ target: document.createElement("div"), stopImmediatePropagation: () => {} });

    button2.tabIndex = 2;
    // @ts-expect-error this is fine, we are testing some internals
    trap.state.mostRecentlyFocusedNode = button2;
    // @ts-expect-error this is fine, we are testing some internals
    trap.handleFocus({ target: document.createElement("div"), stopImmediatePropagation: () => {} });

    button1.tabIndex = 2;
    // @ts-expect-error this is fine, we are testing some internals
    trap.state.mostRecentlyFocusedNode = button1;
    // @ts-expect-error this is fine, we are testing some internals
    trap.handleFocus({ target: document.createElement("div"), stopImmediatePropagation: () => {} });
    await wait();
    // @ts-expect-error this is fine, we are testing some internals
    trap.state.recentNavEvent = { key: "Tab" };
    // @ts-expect-error this is fine, we are testing some internals
    trap.state.mostRecentlyFocusedNode = button1;
    // @ts-expect-error this is fine, we are testing some internals
    trap.handleFocus({ target: document.createElement("div"), stopImmediatePropagation: () => {} });

    // @ts-expect-error this is fine, we are testing some internals
    trap.config.isKeyForward = () => false;
    // @ts-expect-error this is fine, we are testing some internals
    trap.state.mostRecentlyFocusedNode = button2;
    // @ts-expect-error this is fine, we are testing some internals
    trap.handleFocus({ target: document.createElement("div"), stopImmediatePropagation: () => {} });
    // @ts-expect-error this is fine, we are testing some internals
    trap.state.mostRecentlyFocusedNode.tabIndex = 0;
    // @ts-expect-error this is fine, we are testing some internals
    trap.handleFocus({ target: document.createElement("div"), stopImmediatePropagation: () => {} });

    trap.deactivate();
  });

  test("Should handle a null node in tryFocus without throwing", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { isKeyForward: () => true });
    trap.activate();

    await expect.element(button1).toHaveFocus();

    // @ts-expect-error this is fine, we are testing some internals
    trap.tryFocus(null);

    trap.deactivate();
  });

  test("Should handle all internal findNextNavNode branches", async () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, { isKeyForward: () => true, fallbackFocus: () => button1 });
    trap.activate();

    await expect.element(button1).toHaveFocus();

    // @ts-expect-error this is fine, we are testing some internals
    trap.findNextNavNode({ event: { target: document.createElement("div") }, isBackward: true });

    // @ts-expect-error this is fine, we are testing some internals
    trap.findNextNavNode({ event: { target: div }, isBackward: true });

    // @ts-expect-error this is fine, we are testing some internals
    const original = trap.state.tabbableGroups.__proto__.findIndex;
    // @ts-expect-error this is fine, we are testing some internals
    trap.state.tabbableGroups.__proto__.findIndex = () => 1;
    div.tabIndex = 1;
    // @ts-expect-error this is fine, we are testing some internals
    trap.findNextNavNode({ event: { target: div }, isBackward: true });

    const res = [-1, 0];
    // @ts-expect-error this is fine, we are testing some internals
    trap.state.tabbableGroups.__proto__.findIndex = () => res.pop();
    // @ts-expect-error this is fine, we are testing some internals
    trap.findNextNavNode({ event: { target: div }, isBackward: false });

    res.push(0, 0);
    // @ts-expect-error this is fine, we are testing some internals
    trap.findNextNavNode({ event: { target: div }, isBackward: false });

    res.push(0, 0);
    div.tabIndex = -1;
    // @ts-expect-error this is fine, we are testing some internals
    trap.findNextNavNode({ event: { target: div }, isBackward: false });

    res.push(-1);
    // @ts-expect-error this is fine, we are testing some internals
    trap.state.containers = [];
    // @ts-expect-error this is fine, we are testing some internals
    trap.findNextNavNode({ event: { target: div }, isBackward: false });

    // @ts-expect-error this is fine, we are testing some internals
    trap.state.tabbableGroups.__proto__.findIndex = original;
    trap.deactivate();
  });

  test("Should handle activation when no element is focused before activation", () => {
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");

    div.appendChild(button1);
    div.appendChild(button2);

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {});
    vi.spyOn(document, "activeElement", "get").mockImplementationOnce(() => null);

    trap.activate();

    vi.clearAllMocks();
    vi.resetAllMocks();

    trap.deactivate();
  });
});
