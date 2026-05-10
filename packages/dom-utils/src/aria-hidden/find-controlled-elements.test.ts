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
import { findControlledElements } from "./find-controlled-elements.js";

// Elements must be in the document so getElementById resolves correctly.
function mount(): { root: HTMLElement; cleanup: () => void } {
  const root = document.createElement("div");
  document.body.appendChild(root);
  return { root, cleanup: () => root.remove() };
}

function makeController(root: HTMLElement, controlledId: string, expanded = true) {
  const btn = document.createElement("button");
  btn.setAttribute("aria-controls", controlledId);
  if (expanded) btn.setAttribute("aria-expanded", "true");
  root.appendChild(btn);
  return btn;
}

function makeControlled(root: HTMLElement, id: string, role: string, modal = false) {
  const el = document.createElement("div");
  el.id = id;
  el.setAttribute("role", role);
  if (modal) el.setAttribute("aria-modal", "true");
  root.appendChild(el);
  return el;
}

describe("findControlledElements", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Should not call the callback when there are no aria-controls elements", () => {
    const { root, cleanup } = mount();
    root.appendChild(document.createElement("div"));
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).not.toHaveBeenCalled();
    cleanup();
  });

  test("Should not follow aria-controls when the controller is not expanded", () => {
    const { root, cleanup } = mount();
    makeController(root, "menu-a", false);
    makeControlled(root, "menu-a", "menu");
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).not.toHaveBeenCalled();
    cleanup();
  });

  test("Should not follow aria-controls when aria-expanded is 'false'", () => {
    const { root, cleanup } = mount();
    const btn = makeController(root, "menu-b", false);
    btn.setAttribute("aria-expanded", "false");
    makeControlled(root, "menu-b", "menu");
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).not.toHaveBeenCalled();
    cleanup();
  });

  test("Should call the callback for an expanded controller with a valid role", () => {
    const { root, cleanup } = mount();
    makeController(root, "menu-c");
    const controlled = makeControlled(root, "menu-c", "menu");
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith(controlled);
    cleanup();
  });

  test("Should not call the callback when the controlled element has no role", () => {
    const { root, cleanup } = mount();
    makeController(root, "el-d");
    const el = document.createElement("div");
    el.id = "el-d";
    root.appendChild(el);
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).not.toHaveBeenCalled();
    cleanup();
  });

  test("Should not call the callback when the controlled element has a non-interactive role", () => {
    const { root, cleanup } = mount();
    makeController(root, "el-e");
    makeControlled(root, "el-e", "tooltip");
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).not.toHaveBeenCalled();
    cleanup();
  });

  test("Should not call the callback when the controlled element is a modal", () => {
    const { root, cleanup } = mount();
    makeController(root, "dialog-f");
    makeControlled(root, "dialog-f", "dialog", true);
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).not.toHaveBeenCalled();
    cleanup();
  });

  test("Should not call the callback when the controlled element ID does not exist in the document", () => {
    const { root, cleanup } = mount();
    makeController(root, "nonexistent-id");
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).not.toHaveBeenCalled();
    cleanup();
  });

  test("Should call the callback for each valid ID in a space-separated aria-controls", () => {
    const { root, cleanup } = mount();
    const btn = document.createElement("button");
    btn.setAttribute("aria-controls", "list-g1 list-g2");
    btn.setAttribute("aria-expanded", "true");
    root.appendChild(btn);
    const el1 = makeControlled(root, "list-g1", "listbox");
    const el2 = makeControlled(root, "list-g2", "listbox");
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenCalledWith(el1);
    expect(cb).toHaveBeenCalledWith(el2);
    cleanup();
  });

  test("Should call the callback for all valid INTERACTIVE_CONTAINER_ROLE roles", () => {
    const { root, cleanup } = mount();
    const roles = ["menu", "listbox", "dialog", "grid", "tree", "region", "application"];
    const controlled: HTMLElement[] = [];

    for (const role of roles) {
      const id = `role-${role}`;
      makeController(root, id);
      controlled.push(makeControlled(root, id, role));
    }

    const cb = vi.fn();
    findControlledElements(root, cb);

    expect(cb).toHaveBeenCalledTimes(roles.length);
    for (const el of controlled) expect(cb).toHaveBeenCalledWith(el);
    cleanup();
  });

  test("Should recursively find controlled elements within a controlled element", () => {
    const { root, cleanup } = mount();
    makeController(root, "outer-h");
    const outer = makeControlled(root, "outer-h", "menu");

    // inner controller lives inside the controlled element
    const innerBtn = document.createElement("button");
    innerBtn.setAttribute("aria-controls", "inner-h");
    innerBtn.setAttribute("aria-expanded", "true");
    outer.appendChild(innerBtn);
    const inner = makeControlled(root, "inner-h", "listbox");

    const cb = vi.fn();
    findControlledElements(root, cb);

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenCalledWith(outer);
    expect(cb).toHaveBeenCalledWith(inner);
    cleanup();
  });

  test("Should only call the callback once when the same ID is referenced by multiple controllers", () => {
    const { root, cleanup } = mount();
    makeController(root, "shared-i");
    makeController(root, "shared-i");
    const controlled = makeControlled(root, "shared-i", "menu");
    const cb = vi.fn();

    findControlledElements(root, cb);

    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith(controlled);
    cleanup();
  });
});
