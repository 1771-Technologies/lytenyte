import { describe, expect, test } from "vitest";
import { isNode } from "../is-node.js";

describe("isNode", () => {
  test("when the value provided is a node like type it should return true", () => {
    expect(isNode({ nodeType: "one" })).toEqual(true);
    expect(isNode(null)).toEqual(false);
    expect(isNode({})).toEqual(false);
  });
});
