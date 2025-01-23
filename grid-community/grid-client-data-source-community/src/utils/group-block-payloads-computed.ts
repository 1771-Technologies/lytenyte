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

    // If the model is empty, then we can skip the rest of the code, there is nothing to group on.
    if (!rowModel.length) return { sizes: [], payloads: [] };

    const pathIdToDirectChildren = new Map<string, RowNode<D>[]>();
    const seenPaths = new Set<string>();

    const nodes = rows.get();
    for (let i = 0; i < nodes.length; i++) processPath("", nodes[i], 0);

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
      // We are at the leaf level - i.e. this is a leaf node that we need to insert into our tree.
      if (modelIndex === rowModel.length) {
        if (!pathIdToDirectChildren.has(path)) pathIdToDirectChildren.set(path, []); // Ensure exists

        // The child to the path rows.
        pathIdToDirectChildren.get(path)!.push(row);
        return;
      }

      // We are at the group level. So we need to get the column for that group index. The grid
      // ensures the row model is valid, so the column must be row groupable.
      const column = api.columnById(rowModel[modelIndex])!;

      // This is the group key for the column. This determines what we should group on.
      const groupKey = String(api.columnFieldGroup(row, column));

      // If it is the first entry in the path, we just use the group key, otherwise we join it with
      // our delimiter for the path.
      const groupPath = path ? path + ROW_DEFAULT_PATH_SEPARATOR + groupKey : groupKey;

      // If we have already seen the path, it means a row node already exists for this path. Hence
      // it doesn't make sense for use to create a node for this path.
      if (!seenPaths.has(groupPath)) {
        seenPaths.add(groupPath);

        // Otherwise we need to create a group node and add it to our current level. When the path
        // is empty this will be our root level.
        const node: RowNodeGroup = {
          id: groupPath,
          kind: ROW_GROUP_KIND,
          pathKey: groupKey,
          rowIndex: null,
          data: {},
        };

        if (!pathIdToDirectChildren.has(path)) pathIdToDirectChildren.set(path, []);
        pathIdToDirectChildren.get(path)!.push(node);
      }

      processPath(groupPath, row, modelIndex + 1);
    }
  });
}
