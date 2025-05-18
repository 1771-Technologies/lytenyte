import { ROW_GROUP_KIND, ROW_LEAF_KIND } from "@1771technologies/grid-constants";
import type { ServerState } from "../create-server-data-source";
import type { AsyncDataResponse } from "../types";
import type { BlockPayload } from "@1771technologies/grid-graph";
import type { RowNodeGroupPro, RowNodeLeafPro } from "@1771technologies/grid-types/pro";

export function handleDataBlocks<D, E>(payload: AsyncDataResponse, state: ServerState<D, E>) {
  const blocks = payload.blocks;
  const lookup = state.blockLoadTimeLookup.peek();

  const defaultExpansion = state.api.peek().getState().rowGroupDefaultExpansion.peek();

  const result: { sizes: { path: string; size: number }[]; payloads: BlockPayload[] } = {
    sizes: [],
    payloads: [],
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    const path = (block.path ?? []).join(state.rowPathSeparator);

    const blockKey = path + "#" + block.blockKey;

    const loadTime = lookup.get(blockKey) ?? 0;
    if (loadTime > payload.reqTime) continue;

    const expansions = block.frame.expansions ?? {};
    const ids = block.frame.ids;
    const datum = block.frame.data;
    const kinds = block.frame.kinds;
    const pathKeys = block.frame.pathKeys;
    const childCounts = block.frame.childCounts;

    result.sizes.push({ path, size: block.size });

    const nodes = datum.map((d, i) => {
      const kind = kinds[i];
      if (kind === ROW_LEAF_KIND) {
        return {
          id: ids[i],
          data: d as D,
          kind: ROW_LEAF_KIND,
          rowIndex: null,
          rowPin: null,
        } satisfies RowNodeLeafPro<D>;
      }
      if (kind === ROW_GROUP_KIND) {
        let expanded = expansions[ids[i]] ?? state.rowGroupExpansions.get(ids[i]);
        if (expanded == null) {
          expanded =
            typeof defaultExpansion === "number"
              ? (block.path?.length ?? 0) <= defaultExpansion
              : defaultExpansion;
        }

        const pathKey = pathKeys[i];
        if (pathKey == null) {
          console.error("Handling", payload);
          throw new Error(
            "The server responded with null for the path key of a row group node. Every row group node should have a corresponding path key in the response.",
          );
        }

        const childCount = childCounts[i];
        if (childCount == null) {
          console.error("Handling", payload);
          throw new Error(
            "The server responded with null for the child count of a rwo group node. Every row group node must have a child count, even if the row is not expanded",
          );
        }

        let childPath = path + state.rowPathSeparator + pathKey;
        if (childPath.startsWith(state.rowPathSeparator))
          childPath = childPath.replace(state.rowPathSeparator, "");

        result.sizes.push({ size: childCount, path: childPath });

        return {
          id: ids[i],
          data: d as any,
          kind: ROW_GROUP_KIND,
          rowIndex: null,
          pathKey,
        } satisfies RowNodeGroupPro;
      }

      console.error("Handling", payload);
      throw new Error(
        "The server responded with an unknown row kind. The value should be 1 for leaf rows and 2 row group rows",
      );
    });

    result.payloads.push({
      data: nodes,
      index: block.blockKey,
      path,
    });
  }

  for (const z of result.sizes) {
    state.graph.blockSetSize(z.path, z.size);
  }

  state.graph.blockAdd(result.payloads);
}
