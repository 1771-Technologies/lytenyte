import { ROW_BLANK_GROUP_KEY, ROW_GROUP_KIND } from "@1771technologies/grid-constants";
import type {
  RowNodeCore,
  RowNodeGroupCore,
  RowNodeLeafCore,
} from "@1771technologies/grid-types/core";

export type GroupKeyFunc<DataType> = (row: RowNodeLeafCore<DataType>) => string | null | undefined;
export interface RowTree<DataType> {
  readonly rootIds: string[];
  readonly rowIdToTreeDepth: Record<string, number>;
  readonly rowGroupIdToDataRows: Record<string, number[]>;
  readonly rowIdToRowNode: Record<string, RowNodeCore<DataType>>;
  readonly rowGroupIdToChildRowIds: Record<string, string[]>;
  readonly lastGroupDepth: number;
}

export const UNCOMPUTED_AGGREGATION = {};
export const UNCOMPUTED_COUNT = -1;
export const EMPTY_CACHE: Record<string, RowNodeGroupCore> = {};

type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export function makeRowTree<DataType>(
  rows: RowNodeLeafCore<DataType>[],
  indices: number[],
  groupKeys: GroupKeyFunc<DataType>[],
): RowTree<DataType> {
  // Maps the row id to the actual row node created for it
  const rowIdToRowNode: Record<string, RowNodeCore<DataType>> = {};
  // Maps a groups row to the data rows that were used to create it. This is useful for calculating aggregations.
  const rowGroupIdToDataRows: Record<string, number[]> = {};
  // Maps a groups row to the child ids that make up that groups row
  const rowGroupIdToChildRowIds: Record<string, string[]> = {};
  // Maps a row id to the depth it sits in the tree
  const rowIdToTreeDepth: Record<string, number> = {};

  const group = (parentId: string | null, indices: number[], keyIndex: number) => {
    const keyFunc = groupKeys[keyIndex];

    const grouped = new Map<string, number[]>();

    for (let i = 0; i < indices.length; i++) {
      const index = indices[i];
      const row = rows[index];
      const key = keyFunc(row);

      const stringifiedKey = key ? String(key) : ROW_BLANK_GROUP_KEY;

      if (!grouped.has(stringifiedKey)) grouped.set(stringifiedKey, []);
      grouped.get(stringifiedKey)!.push(index);
    }

    const ids: string[] = [];

    for (const [key, data] of grouped.entries()) {
      const id = parentId ? `${parentId}/${key}` : `root:${key}`;
      const childIds =
        keyIndex === groupKeys.length - 1
          ? data.map((dataIndex) => {
              const writableRow = rows[dataIndex] as Writable<RowNodeLeafCore<DataType>>;

              rowIdToRowNode[writableRow.id] = writableRow;
              rowIdToTreeDepth[writableRow.id] = keyIndex + 1;
              return writableRow.id;
            })
          : group(id, data, keyIndex + 1);

      const groupNode = {
        id,
        kind: ROW_GROUP_KIND,
        data: UNCOMPUTED_AGGREGATION, // computed when flattening the tree or when fetching a row
        pathKey: key,
        rowIndex: UNCOMPUTED_COUNT, // computed when flattening the tree
      } satisfies Writable<RowNodeGroupCore>;

      groupNode.rowIndex = UNCOMPUTED_COUNT;

      ids.push(id);
      rowGroupIdToDataRows[id] = data;
      rowIdToRowNode[id] = groupNode;
      rowGroupIdToChildRowIds[id] = childIds;
      rowIdToTreeDepth[id] = keyIndex;
    }

    return ids;
  };

  const rootIds = group(null, indices, 0);

  return {
    rootIds,
    rowIdToRowNode,
    rowGroupIdToChildRowIds,
    rowGroupIdToDataRows,
    rowIdToTreeDepth,
    lastGroupDepth: groupKeys.length - 1,
  };
}
