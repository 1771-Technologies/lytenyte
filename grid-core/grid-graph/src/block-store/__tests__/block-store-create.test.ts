import type { BlockPaths, BlockStore } from "../../types.js";
import { blockStoreCreate } from "../block-store-create.js";

test("should create a block store", () => {
  const lookup: BlockPaths = new Map();

  blockStoreCreate("alpha", 200, lookup);

  expect(lookup.get("alpha")).toEqual<BlockStore>({ size: 200, map: new Map() });

  blockStoreCreate("beta", 0, lookup);
  expect(lookup.get("beta")).toEqual(undefined);
});
