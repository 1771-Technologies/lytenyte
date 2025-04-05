import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { RowNodeLeaf } from "@1771technologies/grid-types/core";

export function createPivotTree<D, E>(api: ApiEnterprise<D, E>, leafRows: RowNodeLeaf<D>[]) {
  const sx = api.getState();
  const measureModel = sx.measureModel.peek();
  const columnPivotModel = sx.columnPivotModel.peek();

  const measureEntries = Object.entries(measureModel);

  if (!measureEntries.length || !columnPivotModel.length) {
    return [];
  }

  const pivotedColumns = columnPivotModel.map((id) => api.columnById(id)).filter((c) => c != null);

  const separator = sx.columnGroupIdDelimiter.peek();
  const paths = new Set<string>(measureEntries.map(([id]) => `total${separator}${id}`));

  for (let i = 0; i < leafRows.length; i++) {
    const current: string[] = [];
    const row = leafRows[i];
    for (const column of pivotedColumns) {
      const pivotKey = String(api.columnPivotField(row, column));
      current.push(pivotKey);

      for (const [measure] of measureEntries) {
        paths.add([...current, measure].join(separator));
      }
    }
  }

  return [...paths].sort((left, right) => {
    left = left.toLowerCase();
    right = right.toLowerCase();
    const leftSplit = left.split(separator);
    const rightSplit = right.split(separator);

    const lastLeft = leftSplit.at(-1)!;
    const lastRight = rightSplit.at(-1)!;

    leftSplit.pop();
    rightSplit.pop();

    /* v8 ignore start */
    if (lastLeft === lastRight) {
      if (left.startsWith("total")) {
        return -1;
      } else if (right.startsWith("total")) {
        return 1;
      }

      let leftI = 0;
      let rightI = 0;
      while (leftI < leftSplit.length && rightI < rightSplit.length) {
        const l = leftSplit[leftI];
        const r = rightSplit[rightI];
        if (l < r) {
          return -1;
        } else if (l > r) {
          return 1;
        }

        leftI++;
        rightI++;
      }
      if (leftSplit[leftI] === undefined) {
        return -1;
      } else if (rightSplit[rightI] === undefined) {
        return 1;
      }

      return 0;
    } else if (lastLeft < lastRight) {
      return -1;
    } else {
      return 1;
    }
  });
}
