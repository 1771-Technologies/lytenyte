import type { RowLeaf, RowSource } from "@1771technologies/lytenyte-shared";
import type { RowSourceClient, UseClientDataSourceParams } from "../data-source/use-client-data-source.js";
import { useEvent } from "../hooks/use-event.js";

export function useRowDelete<T>(props: UseClientDataSourceParams<T>, rowById: RowSource<T>["rowById"]) {
  const rowDelete: RowSourceClient<T>["rowDelete"] = useEvent((rows) => {
    const finalRows: RowLeaf<T>[] = [];
    const indices: number[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rowById(rows[i].id);
      if (!row) {
        console.error(`The row with id ${rows[i]?.id} does not exist in the data source.`);
        return;
      }
      if (row.kind !== "leaf") {
        console.error(
          `Only leaf rows may be deleted from the client data source. Non-leaf row provided`,
          row,
        );
        return;
      }

      finalRows.push(row);
      indices.push((row as any).__srcIndex);
    }

    props.onRowsDeleted?.({
      rows: finalRows,
      sourceIndices: indices,
      top: props.topData ?? [],
      center: props.data ?? [],
      bottom: props.bottomData ?? [],
    });
  });

  return rowDelete;
}
