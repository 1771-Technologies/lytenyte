import type { RowSourceClient, UseClientDataSourceParams } from "../data-source/use-client-data-source";
import { useEvent } from "../hooks/use-event.js";

export function useRowAdd<T>(props: UseClientDataSourceParams<T>) {
  const rowAdd: RowSourceClient<T>["rowAdd"] = useEvent((rows, index) => {
    props.onRowsAdded?.({
      newData: rows,
      placement: index ?? "start",
      top: props.topData ?? [],
      center: props.data ?? [],
      bottom: props.bottomData ?? [],
    });
  });

  return rowAdd;
}
