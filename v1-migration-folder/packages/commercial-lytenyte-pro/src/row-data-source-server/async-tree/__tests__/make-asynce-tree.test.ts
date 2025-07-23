import { expect, test } from "vitest";
import { makeAsyncTree } from "../make-async-tree";
import { printTreeByIndex } from "./print-tree";

test("makeAsyncTree: should make a tree with and api the sets the correct values", () => {
  const t = makeAsyncTree();

  t.set({
    path: [],
    size: 20,
    items: [
      {
        kind: "leaf",
        data: 2,
        relIndex: 0,
      },
    ],
  });

  expect(printTreeByIndex(t)).toMatchInlineSnapshot(`
    "
    #
    ├─ 0 / L / $#0 / $ / DATA: 2"
  `);

  expect(t.size).toEqual(20);

  t.delete({ path: [] });
  t.get({ path: [] });
});
