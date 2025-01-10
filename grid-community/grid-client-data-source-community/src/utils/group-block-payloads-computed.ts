import { computed, type ReadonlySignal, type Signal } from "@1771technologies/react-cascada";
import { ROW_DEFAULT_PATH_SEPARATOR, ROW_GROUP_KIND } from "@1771technologies/grid-constants";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { RowNode, RowNodeGroup, RowNodeLeaf } from "@1771technologies/grid-types/community";
import { BLOCK_SIZE } from "./flat-block-payloads-computed";
import type { BlockPayload } from "@1771technologies/grid-graph";

export function groupBlockPayloadsComputed<D, E>(
  api$: Signal<ApiEnterprise<D, E>> | Signal<ApiCommunity<D, E>>,
  rows: ReadonlySignal<RowNodeLeaf<D>[]>,
) {
  return computed(() => {
    const api = api$.get() as ApiEnterprise<D, E>;
    const sx = api.getState();

    const rowModel = sx.rowGroupModel.get();

    if (!rowModel.length) return { sizes: [], payloads: [] };

    const pathIdToDirectChildren = new Map<string, RowNode<D>[]>();
    const seenPaths = new Set<string>();

    const defaultExpansion = sx.rowGroupDefaultExpansion.peek();

    const nodes = rows.get();
    for (let i = 0; i < nodes.length; i++) {
      let path = "";
      processPath(path, nodes[i], 0);
    }

    const result: { sizes: { path: string; size: number }[]; payloads: BlockPayload<D>[] } = {
      sizes: [],
      payloads: [],
    };

    for (const [path, rows] of pathIdToDirectChildren.entries()) {
      const blocks = Math.ceil(rows.length / BLOCK_SIZE);

      result.sizes.push({ size: rows.length, path });

      for (let i = 0; i < blocks; i++) {
        result.payloads.push({
          path,
          index: i,
          data: rows.slice(i * BLOCK_SIZE, i * BLOCK_SIZE + BLOCK_SIZE),
        });
      }
    }

    return result;

    // Helpers

    function processPath(path: string, row: RowNodeLeaf<D>, modelIndex: number) {
      // We are at the leaf level
      if (modelIndex === rowModel.length) {
        if (!pathIdToDirectChildren.has(path)) pathIdToDirectChildren.set(path, []);
        pathIdToDirectChildren.get(path)!.push(row);

        return;
      }

      // We are at the group level
      const column = api.columnById(rowModel[modelIndex])!;

      const groupKey = String(api.columnFieldGroup(row, column));
      const groupPath = path + ROW_DEFAULT_PATH_SEPARATOR + groupKey;
      if (!seenPaths.has(groupPath)) {
        // We need to create a group node and add it to the direct children for this group.
        const node: RowNodeGroup = {
          id: groupPath,
          kind: ROW_GROUP_KIND,
          pathKey: groupKey,
          rowIndex: null,
          expanded:
            typeof defaultExpansion === "number"
              ? modelIndex <= defaultExpansion
              : defaultExpansion,
          data: {},
        };

        if (!pathIdToDirectChildren.has(path)) pathIdToDirectChildren.set(path, []);
        pathIdToDirectChildren.get(path)!.push(node);
      }

      processPath(groupPath, row, modelIndex + 1);
    }
  });
}
