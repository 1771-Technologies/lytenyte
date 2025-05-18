import type { BlockPaths, BlockPayload } from "../../types.js";
import { blockStoreUpdateNodes } from "../block-store-update-nodes.js";
import { makeRowNodes } from "./make-row-nodes.js";
import { prettyPrintBlockPaths } from "./pretty-print-block.js";

test("block store update should handle node updates", () => {
  const nodes = makeRowNodes([
    [2, "x"],
    [1, "z"],
    [3, "z"],
  ]);

  const payload: BlockPayload = {
    data: nodes,
    index: 1,
    path: "alpha",
  };

  const lookup: BlockPaths = new Map();
  lookup.set("alpha", { size: 20, map: new Map() });

  blockStoreUpdateNodes(nodes, payload, lookup);

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
    "PATH                          BLOCKS    SIZE      DATA
    ────────────────────────────────────────────────────────────────────────────────
    alpha                         1         20        1=[2:x, 1:z, 3:z]"
  `);

  // should override data if necessary
  blockStoreUpdateNodes(makeRowNodes([[1, ""]]), payload, lookup);

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
    "PATH                          BLOCKS    SIZE      DATA
    ────────────────────────────────────────────────────────────────────────────────
    alpha                         1         20        1=[1:""]"
  `);

  blockStoreUpdateNodes(makeRowNodes([[2, ""]]), { ...payload, index: 2 }, lookup);

  expect(prettyPrintBlockPaths(lookup)).toMatchInlineSnapshot(`
    "PATH                          BLOCKS    SIZE      DATA
    ────────────────────────────────────────────────────────────────────────────────
    alpha                         2         20        1=[1:""], 2=[2:""]"
  `);

  const err = console.error;
  console.error = vi.fn();
  blockStoreUpdateNodes(nodes, { data: nodes, index: 1, path: "beta" }, lookup);
  expect(console.error).toHaveBeenCalledOnce();
  console.error = err;
});
