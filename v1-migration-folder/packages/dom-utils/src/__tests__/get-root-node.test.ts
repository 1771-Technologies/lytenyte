import { expect, test } from "vitest";
import { getRootNode } from "../get-root-node";

test("getRootNode: should work when getRootNode is not defined", () => {
  globalThis.Element = {} as any;

  const el = { ownerDocument: 2 } as any;
  expect(getRootNode(el)).toEqual(2);
});
