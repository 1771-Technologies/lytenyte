import { describe, expect, test } from "vitest";
import { isNode } from "./is-node.js";

describe("isNode", () => {
  test("Should return true for node-like values and false for null or plain objects", () => {
    expect(isNode({ nodeType: "one" })).toEqual(true);
    expect(isNode(null)).toEqual(false);
    expect(isNode({})).toEqual(false);
  });
});
