import { computed, signal } from "@1771technologies/cascada";
import { columnsByPin } from "@1771technologies/grid-core";
import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import { containsADuplicateId } from "@1771technologies/js-utils";
import { columnHandleGroupColumn } from "./column-handle-group-column";
import { columnHandleMarker } from "./column-handle-marker-column";

export function columnsComputed<D, E>(
  rawColumns: ColumnCommunity<D, E>[] | ColumnEnterprise<D, E>[],
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  pivots: boolean = false,
) {
  rawColumns = rawColumns as ColumnCommunity<D, E>[];
  api = api as ApiCommunity<D, E>;

  const processColumns = (c: ColumnCommunity<D, E>[]) => {
    if (containsADuplicateId(c)) {
      console.error(c);
      throw new Error("Duplicate column id detected. Every column should have a unique ID.");
    }
    const sx = api.getState();

    const columnsWithGroup = columnHandleGroupColumn({
      columns: c,
      rowGroupModel: sx.rowGroupModel.get(),
      rowGroupColumnTemplate: sx.rowGroupColumnTemplate.get() ?? {},
      rowGroupDisplayMode: sx.rowGroupDisplayMode.get(),
    });

    const columnsWithMarker = columnHandleMarker({
      columns: columnsWithGroup,
      rowDetailEnabled: sx.rowDetailPredicate.get() !== false,
      rowDetailMarker: sx.rowDetailMarker.get(),
      rowDragActivator: sx.rowDragActivator.get(),
      rowDragEnabled: sx.rowDragEnabled.get(),
      rowSelectionCheckbox: sx.rowSelectionCheckbox.get(),
      rowSelectionMode: sx.rowSelectionMode.get(),
    });

    const byPin = columnsByPin(columnsWithMarker);
    return [...byPin.start, ...byPin.center, ...byPin.end];
  };

  const columns$ = signal(rawColumns, { postUpdate: () => !pivots && api.cellEditEndAll(true) });
  const columns = computed(
    () => {
      const columns = processColumns(columns$.get());

      return columns;
    },
    (v) => {
      return v;
    },
  );

  return columns as any;
}
