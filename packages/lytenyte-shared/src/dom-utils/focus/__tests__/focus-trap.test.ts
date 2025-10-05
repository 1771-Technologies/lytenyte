import { describe, expect, test, vi } from "vitest";
import { userEvent } from "@vitest/browser/context";
import { FocusTrap } from "../focus-trap.js";
import { wait } from "@1771technologies/lytenyte-shared";

describe("focusTrap", () => {
  test("when the provided container has focusable items it should be possible to trap the items in", async () => {
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

  test("the focus trap should ensure focus cannot be moved outside of the container", async () => {
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

  test("the focus trap should be responsive to new elements being added", async () => {
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

  test("the focus trap should be responsive to the active element being removed", async () => {
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

  test("the focus trap should focus the initial node when activated", async () => {
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

  test("the focus trap should allow for a fallback focus when it is not longer active", async () => {
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

  test("the focus trap should be able to keep its focus when the focus is no longer active", async () => {
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

  test("the focus trap should be able to specify its return focus", async () => {
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

  test("the focus trap should handle the case where the return focus returns false", async () => {
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

  test("the focus trap should allow clicks outside if set", async () => {
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

  test("the focus trap should prevent clicks outside if set", async () => {
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

  test("focus traps should be nestable", async () => {
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

  test("focus trap should work across more than a single container", async () => {
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

  test("focus trap should be pausable and restartable", async () => {
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

  test("when the trap stack is empty the trap.deactivate should work fine", () => {
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

  test("when there are listeners provided they should be called", async () => {
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

  test("when the trap has been deactivated, pausing and unpausing should not add/remove listeners", async () => {
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

  test("when return focus is specified and the trap should check then it checks", async () => {
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

  test("when there are no possible tabbables and there is no fallback provided the trap should throw", () => {
    const div = document.createElement("div");

    document.body.appendChild(div);

    const trap = new FocusTrap(div, {});

    expect(() => trap.activate()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Your focus-trap must have at least one container with at least one tabbable node in it at all times]`,
    );
  });

  test("when there are multiple containers in the trap and more than one tabbable has a positive index the trap should throw", () => {
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

  test("when the initial focus is not delayed the focus trap should try an immediately focus the node", async () => {
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

  test("when activating the trap should wait until check focus is resolved", async () => {
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

  test("when focus is active and a focusable is clicked inside of the container it should get focus", async () => {
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

  test("when click to deactivate is set and a focusable outside is clicked then the trap should deactivate", async () => {
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

  test("when the container is on a negative tab index node and target is focusable but not tabbable should move to the correct node", async () => {
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

  test("when custom forward and previous buttons are used the focus should move correctly", async () => {
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

  test("when the focus is a select input", async () => {
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

  test("when the docs default view is not set, the focus trap should fallback to the window", async () => {
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

  test("when escape should deactivate the trap deactivates", async () => {
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

  test("when the target is not contained and the document gets focused", async () => {
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

  test("when the target is not contained and the document gets focused and the element is changed", async () => {
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

  test("when the target is not contained but the tabbables have items", async () => {
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

  test("when the initial focus is false, should return", async () => {
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

  test("when the initial node is not focusable the focus trap should try focusing the first node that is", async () => {
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

  test("when the initial node is not focusable and there are no tabbable nodes, the fallback should be used", async () => {
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

  test("when the initial node is null the fallback node should be used", async () => {
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

  test("when the initial node is null and the fallback is not defined it should throw", async () => {
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

  test("when the initial node is null and the fallback is null it should throw", async () => {
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

  test("when the node is not connected the trap focus should use the fallback", async () => {
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

  test("when the option value is true it should focus the first node", async () => {
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

  test("when the option value is null the trap should throw", async () => {
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

  test("when both the initial focus and the fallback focus return null the trap should throw", () => {
    const div = document.createElement("div");
    const trap = new FocusTrap(div, { fallbackFocus: "#id", initialFocus: "#id" });
    expect(() => trap.activate()).toThrowErrorMatchingInlineSnapshot(
      `[Error: \`fallbackFocus\` as selector refers to no known node]`,
    );

    trap.deactivate();
  });

  test("when the initial focus is a query selector it should handle the query", async () => {
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

  test("when both the initial selector is badly formed it should throw", () => {
    const div = document.createElement("div");
    const trap = new FocusTrap(div, { fallbackFocus: "{{" });
    expect(() => trap.activate()).toThrowError(
      "`fallbackFocus` appears to be an invalid selector;",
    );

    trap.deactivate();
  });

  test("when activate is provided options they should be used", async () => {
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
  test("handleFocus Internals coverage", async () => {
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

  test("tryFocus internal", async () => {
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

  test("findNextNavNode internal", async () => {
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

  test("when activating the trap should handle the case where there is not focusable node before activation", () => {
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
