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

import { describe, expect, test, afterEach, vi } from "vitest";
import { hideOthers, inertOthers, suppressOthers } from "./aria-hidden.js";

function setup(...counts: number[]) {
  const target = document.createElement("div");
  const siblings = counts.map(() => document.createElement("div"));
  document.body.append(target, ...siblings);
  return {
    target,
    siblings,
    cleanup: () => {
      target.remove();
      siblings.forEach((s) => s.remove());
    },
  };
}

describe("hideOthers", () => {
  afterEach(() => vi.restoreAllMocks());

  test("Should set aria-hidden='true' on siblings outside the target", () => {
    const { target, siblings, cleanup } = setup(1);
    const undo = hideOthers(target);

    expect(siblings[0].getAttribute("aria-hidden")).toBe("true");
    undo?.();
    cleanup();
  });

  test("Should not set aria-hidden on the target itself", () => {
    const { target, cleanup } = setup(1);
    const undo = hideOthers(target);

    expect(target.hasAttribute("aria-hidden")).toBe(false);
    undo?.();
    cleanup();
  });

  test("Should remove aria-hidden on cleanup", () => {
    const { target, siblings, cleanup } = setup(1);
    const undo = hideOthers(target);
    undo?.();

    expect(siblings[0].hasAttribute("aria-hidden")).toBe(false);
    cleanup();
  });

  test("Should apply data-aria-hidden as the default marker attribute", () => {
    const { target, siblings, cleanup } = setup(1);
    const undo = hideOthers(target);

    expect(siblings[0].hasAttribute("data-aria-hidden")).toBe(true);
    undo?.();
    cleanup();
  });

  test("Should use a custom markerName when provided", () => {
    const { target, siblings, cleanup } = setup(1);
    const undo = hideOthers(target, document.body, "data-custom-marker");

    expect(siblings[0].hasAttribute("data-custom-marker")).toBe(true);
    undo?.();
    cleanup();
  });

  test("Should use a custom parentNode when provided", () => {
    const parent = document.createElement("section");
    const target = document.createElement("div");
    const sibling = document.createElement("div");
    parent.append(target, sibling);
    document.body.appendChild(parent);

    const undo = hideOthers(target, parent);

    expect(sibling.getAttribute("aria-hidden")).toBe("true");
    undo?.();
    parent.remove();
  });

  test("Should return undefined and do nothing when parentNode is null", () => {
    const target = document.createElement("div");
    const result = hideOthers(target, null as any);
    expect(result).toBeUndefined();
  });

  test("Should accept an array of targets and keep all of them visible", () => {
    const { siblings, cleanup } = setup(1, 1);
    const [sibling1, sibling2] = siblings;

    // Use both siblings as targets; only the body's other children get hidden.
    const undo = hideOthers([sibling1, sibling2], document.body);

    expect(sibling1.hasAttribute("aria-hidden")).toBe(false);
    expect(sibling2.hasAttribute("aria-hidden")).toBe(false);
    undo?.();
    cleanup();
  });

  test("Should derive parentNode from the first element when an array is passed without an explicit parentNode", () => {
    const { siblings, cleanup } = setup(1, 1);
    const [sibling1, sibling2] = siblings;

    // No parentNode argument — getParentNode() is called with the array and takes originalTarget[0].
    const undo = hideOthers([sibling1, sibling2]);

    expect(sibling1.hasAttribute("aria-hidden")).toBe(false);
    expect(sibling2.hasAttribute("aria-hidden")).toBe(false);
    undo?.();
    cleanup();
  });
});

describe("inertOthers", () => {
  afterEach(() => vi.restoreAllMocks());

  test("Should set inert='' on siblings outside the target", () => {
    const { target, siblings, cleanup } = setup(1);
    const undo = inertOthers(target);

    expect(siblings[0].getAttribute("inert")).toBe("");
    undo?.();
    cleanup();
  });

  test("Should not set inert on the target itself", () => {
    const { target, cleanup } = setup(0);
    const undo = inertOthers(target);

    expect(target.hasAttribute("inert")).toBe(false);
    undo?.();
    cleanup();
  });

  test("Should remove inert on cleanup", () => {
    const { target, siblings, cleanup } = setup(1);
    const undo = inertOthers(target);
    undo?.();

    expect(siblings[0].hasAttribute("inert")).toBe(false);
    cleanup();
  });

  test("Should apply data-inerted as the default marker attribute", () => {
    const { target, siblings, cleanup } = setup(1);
    const undo = inertOthers(target);

    expect(siblings[0].hasAttribute("data-inerted")).toBe(true);
    undo?.();
    cleanup();
  });

  test("Should return undefined and do nothing when parentNode is null", () => {
    const target = document.createElement("div");
    const result = inertOthers(target, null as any);
    expect(result).toBeUndefined();
  });
});

describe("suppressOthers", () => {
  afterEach(() => vi.restoreAllMocks());

  test("Should use inertOthers (inert attribute) when inert is supported", () => {
    // In this environment inert is supported, so inertOthers should be used.
    const { target, siblings, cleanup } = setup(1);
    const undo = suppressOthers(target);

    expect(siblings[0].getAttribute("inert")).toBe("");
    expect(siblings[0].hasAttribute("aria-hidden")).toBe(false);
    undo?.();
    cleanup();
  });

  test("Should fall back to hideOthers (aria-hidden) when inert is not supported", () => {
    const { target, siblings, cleanup } = setup(1);

    const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "inert");
    delete (HTMLElement.prototype as any).inert;

    const undo = suppressOthers(target);
    expect(siblings[0].getAttribute("aria-hidden")).toBe("true");
    expect(siblings[0].hasAttribute("inert")).toBe(false);
    undo?.();

    if (descriptor) Object.defineProperty(HTMLElement.prototype, "inert", descriptor);
    cleanup();
  });

  test("Should apply data-suppressed as the default marker attribute", () => {
    const { target, siblings, cleanup } = setup(1);
    const undo = suppressOthers(target);

    expect(siblings[0].hasAttribute("data-suppressed")).toBe(true);
    undo?.();
    cleanup();
  });

  test("Should return undefined and do nothing when parentNode is null", () => {
    const target = document.createElement("div");
    const result = suppressOthers(target, null as any);
    expect(result).toBeUndefined();
  });
});
