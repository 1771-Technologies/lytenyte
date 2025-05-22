import { expect, test } from "vitest";
import { isNodeAttached } from "../is-node-attached";

test("isNodeAttached: should return the correct result", () => {
  const d = document.createElement("div");
  expect(isNodeAttached(d)).toEqual(false);

  document.body.appendChild(d);
  expect(isNodeAttached(d)).toEqual(true);
});

// Attached shadow DOM
test("isNodeAttached: returns true for node in attached shadow DOM", () => {
  const host = document.createElement("div");
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const child = document.createElement("span");
  shadow.appendChild(child);

  expect(isNodeAttached(child)).toEqual(true);
});

// Detached shadow DOM
test("isNodeAttached: returns false for node in detached shadow DOM", () => {
  const host = document.createElement("div");
  const shadow = host.attachShadow({ mode: "open" });
  const child = document.createElement("span");
  shadow.appendChild(child);

  expect(isNodeAttached(child)).toEqual(false);
});

// Nested shadow DOM attached
test("isNodeAttached: returns true for node in nested attached shadow DOM", () => {
  const outerHost = document.createElement("div");
  document.body.appendChild(outerHost);

  const outerShadow = outerHost.attachShadow({ mode: "open" });
  const innerHost = document.createElement("div");
  outerShadow.appendChild(innerHost);

  const innerShadow = innerHost.attachShadow({ mode: "open" });
  const innerChild = document.createElement("span");
  innerShadow.appendChild(innerChild);

  expect(isNodeAttached(innerChild)).toEqual(true);
});

// Nested shadow DOM detached
test("isNodeAttached: returns false for node in nested detached shadow DOM", () => {
  const outerHost = document.createElement("div");

  const outerShadow = outerHost.attachShadow({ mode: "open" });
  const innerHost = document.createElement("div");
  outerShadow.appendChild(innerHost);

  const innerShadow = innerHost.attachShadow({ mode: "open" });
  const innerChild = document.createElement("span");
  innerShadow.appendChild(innerChild);

  expect(isNodeAttached(innerChild)).toEqual(false);
});
