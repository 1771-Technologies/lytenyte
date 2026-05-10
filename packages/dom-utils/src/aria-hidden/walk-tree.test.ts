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

import { describe, expect, test, vi, afterEach } from "vitest";
import { walkTreeOutside } from "./walk-tree.js";

const CONTROL = "aria-hidden";
const MARKER = "data-aria-hidden-marker";

// Base props shared across most tests.
const baseProps = (parentNode: HTMLElement) => ({
  parentNode,
  markerName: MARKER,
  controlAttribute: CONTROL,
  explicitBooleanValue: true,
});

function mount() {
  const parent = document.createElement("div");
  document.body.appendChild(parent);
  return {
    parent,
    cleanup: () => parent.remove(),
  };
}

describe("walkTreeOutside", () => {
  // Safety net: restore mocks after each test.
  afterEach(() => vi.restoreAllMocks());

  test("Should set controlAttribute on siblings outside the target", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target, sibling);

    const undo = walkTreeOutside(target, baseProps(parent));

    expect(sibling.getAttribute(CONTROL)).toBe("true");
    undo();
    cleanup();
  });

  test("Should not set controlAttribute on the target itself", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target, sibling);

    const undo = walkTreeOutside(target, baseProps(parent));

    expect(target.hasAttribute(CONTROL)).toBe(false);
    undo();
    cleanup();
  });

  test("Should not set controlAttribute on descendants of the target", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const inner = document.createElement("span");
    target.appendChild(inner);
    parent.appendChild(target);

    const undo = walkTreeOutside(target, baseProps(parent));

    expect(inner.hasAttribute(CONTROL)).toBe(false);
    undo();
    cleanup();
  });

  test("Should hide siblings of an ancestor of the target", () => {
    const { parent, cleanup } = mount();
    // parent > intermediary > target
    //       > unrelated  ← should be hidden
    // intermediary > sibling-of-target ← should be hidden
    const intermediary = document.createElement("div");
    const target = document.createElement("div");
    const siblingOfTarget = document.createElement("div");
    const unrelated = document.createElement("div");
    intermediary.append(target, siblingOfTarget);
    parent.append(intermediary, unrelated);

    const undo = walkTreeOutside(target, baseProps(parent));

    expect(siblingOfTarget.getAttribute(CONTROL)).toBe("true");
    expect(unrelated.getAttribute(CONTROL)).toBe("true");
    expect(intermediary.hasAttribute(CONTROL)).toBe(false);
    expect(target.hasAttribute(CONTROL)).toBe(false);
    undo();
    cleanup();
  });

  test("Should set controlAttribute to 'true' when explicitBooleanValue is true", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target, sibling);

    const undo = walkTreeOutside(target, { ...baseProps(parent), explicitBooleanValue: true });

    expect(sibling.getAttribute(CONTROL)).toBe("true");
    undo();
    cleanup();
  });

  test("Should set controlAttribute to '' when explicitBooleanValue is false", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target, sibling);

    const undo = walkTreeOutside(target, { ...baseProps(parent), explicitBooleanValue: false });

    expect(sibling.getAttribute(CONTROL)).toBe("");
    undo();
    cleanup();
  });

  test("Should remove controlAttribute on cleanup", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target, sibling);

    const undo = walkTreeOutside(target, baseProps(parent));
    expect(sibling.hasAttribute(CONTROL)).toBe(true);

    undo();

    expect(sibling.hasAttribute(CONTROL)).toBe(false);
    cleanup();
  });

  test("Should set the markerName attribute on hidden nodes", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target, sibling);

    const undo = walkTreeOutside(target, baseProps(parent));

    expect(sibling.hasAttribute(MARKER)).toBe(true);
    undo();
    cleanup();
  });

  test("Should remove the markerName attribute on cleanup", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target, sibling);

    const undo = walkTreeOutside(target, baseProps(parent));
    undo();

    expect(sibling.hasAttribute(MARKER)).toBe(false);
    cleanup();
  });

  test("Should not remove controlAttribute until all overlapping locks are released", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target, sibling);

    const undo1 = walkTreeOutside(target, baseProps(parent));
    const undo2 = walkTreeOutside(target, baseProps(parent));

    undo1();
    expect(sibling.hasAttribute(CONTROL)).toBe(true);

    undo2();
    expect(sibling.hasAttribute(CONTROL)).toBe(false);
    cleanup();
  });

  test("Should not remove a pre-existing controlAttribute on cleanup", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    sibling.setAttribute(CONTROL, "true");
    parent.append(target, sibling);

    const undo = walkTreeOutside(target, baseProps(parent));
    undo();

    // Attribute was already there before — must not be removed.
    expect(sibling.getAttribute(CONTROL)).toBe("true");
    sibling.removeAttribute(CONTROL);
    cleanup();
  });

  test("Should not hide ignored nodes (aria-live)", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    parent.append(target, liveRegion);

    const undo = walkTreeOutside(target, baseProps(parent));

    expect(liveRegion.hasAttribute(CONTROL)).toBe(false);
    undo();
    cleanup();
  });

  test("Should not hide ignored nodes (script tag)", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const script = document.createElement("script");
    parent.append(target, script);

    const undo = walkTreeOutside(target, baseProps(parent));

    expect(script.hasAttribute(CONTROL)).toBe(false);
    undo();
    cleanup();
  });

  test("Should accept an array of targets and keep all of them visible", () => {
    const { parent, cleanup } = mount();
    const target1 = document.createElement("div");
    const target2 = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target1, target2, sibling);

    const undo = walkTreeOutside([target1, target2], baseProps(parent));

    expect(target1.hasAttribute(CONTROL)).toBe(false);
    expect(target2.hasAttribute(CONTROL)).toBe(false);
    expect(sibling.getAttribute(CONTROL)).toBe("true");
    undo();
    cleanup();
  });

  test("Should keep controlled elements visible when followControlledElements is true", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");

    // Controller inside the target with aria-controls pointing to a sibling menu.
    const controller = document.createElement("button");
    controller.setAttribute("aria-controls", "wt-menu");
    controller.setAttribute("aria-expanded", "true");
    target.appendChild(controller);

    const menu = document.createElement("div");
    menu.id = "wt-menu";
    menu.setAttribute("role", "menu");
    const sibling = document.createElement("div");
    parent.append(target, menu, sibling);
    document.body.appendChild(parent);

    const undo = walkTreeOutside(target, { ...baseProps(parent), followControlledElements: true });

    expect(menu.hasAttribute(CONTROL)).toBe(false);
    expect(sibling.getAttribute(CONTROL)).toBe("true");
    undo();
    cleanup();
  });

  test("Should hide controlled elements when followControlledElements is false", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");

    const controller = document.createElement("button");
    controller.setAttribute("aria-controls", "wt-menu2");
    controller.setAttribute("aria-expanded", "true");
    target.appendChild(controller);

    const menu = document.createElement("div");
    menu.id = "wt-menu2";
    menu.setAttribute("role", "menu");
    parent.append(target, menu);

    const undo = walkTreeOutside(target, {
      ...baseProps(parent),
      followControlledElements: false,
    });

    expect(menu.getAttribute(CONTROL)).toBe("true");
    undo();
    cleanup();
  });

  test("Should treat a pre-existing controlAttribute of 'false' as not hidden when explicitBooleanValue is false", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    // aria-hidden="false" is explicitly "not hidden" — should be overwritten and removed on cleanup.
    sibling.setAttribute(CONTROL, "false");
    parent.append(target, sibling);

    const undo = walkTreeOutside(target, { ...baseProps(parent), explicitBooleanValue: false });

    expect(sibling.getAttribute(CONTROL)).toBe("");

    undo();

    expect(sibling.hasAttribute(CONTROL)).toBe(false);
    cleanup();
  });

  test("Should log an error and continue when a DOM operation throws on a node", () => {
    const { parent, cleanup } = mount();
    const target = document.createElement("div");
    const throwing = document.createElement("div");
    const normal = document.createElement("div");
    parent.append(target, throwing, normal);

    const err = new Error("permission denied");
    vi.spyOn(throwing, "getAttribute").mockImplementation(() => {
      throw err;
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const undo = walkTreeOutside(target, baseProps(parent));

    expect(errorSpy).toHaveBeenCalledWith("[ariaHidden] cannot operate on ", throwing, err);
    // The non-throwing sibling should still be processed normally.
    expect(normal.getAttribute(CONTROL)).toBe("true");
    undo();
    cleanup();
  });
});
