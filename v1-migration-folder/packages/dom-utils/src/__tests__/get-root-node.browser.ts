import { describe, expect, test } from "vitest";
import { getRootNode } from "../get-root-node.js";

describe("getRootNode", () => {
  test("should return the correct result", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    expect(getRootNode(el)).toEqual(el.ownerDocument);

    Element.prototype.getRootNode = null as any;

    expect(getRootNode(el)).toEqual(undefined);
  });
});
