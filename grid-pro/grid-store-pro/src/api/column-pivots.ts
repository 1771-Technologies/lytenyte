import { columnFieldComputer, columnGetField } from "@1771technologies/grid-shared-state";
import type { ApiPro } from "@1771technologies/grid-types/pro";
import { isPromise } from "@1771technologies/js-utils";

export const columnPivots = <D, E>(
  api: ApiPro<D, E>,
): {
  columnPivotFieldFromData: ApiPro<D, E>["columnPivotFieldFromData"];
  columnPivotField: ApiPro<D, E>["columnPivotField"];
  columnPivotFilterModel: ApiPro<D, E>["columnPivotFilterModel"];
  columnPivotMeasureField: ApiPro<D, E>["columnPivotMeasureField"];
  columnPivots: ApiPro<D, E>["columnPivots"];
  columnPivotSetFilterModel: ApiPro<D, E>["columnPivotSetFilterModel"];
  columnPivotSetSortModel: ApiPro<D, E>["columnPivotSetSortModel"];
  columnPivotsLoading: ApiPro<D, E>["columnPivotsLoading"];
  columnPivotSortModel: ApiPro<D, E>["columnPivotSortModel"];
  columnPivotsReload: ApiPro<D, E>["columnPivotsReload"];
} => {
  let prevAbortController: AbortController | null = null;

  return {
    columnPivotFieldFromData: (d, c) => {
      const field = c.columnPivotField ?? c.field ?? c.id;
      return columnGetField(d, field, c, api);
    },
    columnPivotField: (row, c) => {
      const field = c.columnPivotField ?? c.field ?? c.id;
      return columnFieldComputer(api, row, c, "pivot", field);
    },
    columnPivotFilterModel: () => api.getState().internal.columnPivotFilterModel.peek(),
    columnPivotMeasureField: (d, c) => {
      const field = c.field ?? c.id;
      return columnGetField(d, field, c, api);
    },
    columnPivots: () => api.getState().internal.columnPivotColumns.peek(),
    columnPivotSetFilterModel: (s) => {
      api.getState().internal.columnPivotFilterModel.set(s);
    },
    columnPivotSetSortModel: (s) => {
      api.getState().internal.columnPivotSortModel.set(s);
    },
    columnPivotsLoading: () => api.getState().internal.columnPivotsLoading.peek(),
    columnPivotSortModel: () => api.getState().internal.columnPivotSortModel.peek(),
    columnPivotsReload: () => {
      const sx = api.getState();
      const rds = sx.internal.rowBackingDataSource.peek();

      const pivots = rds.columnPivots(api);

      if (prevAbortController) {
        prevAbortController.abort();
        prevAbortController = null;
      }

      if (isPromise(pivots)) {
        api.eventFire("onColumnPivotsRequested", { api });
        const controller = new AbortController();
        prevAbortController = controller;

        sx.internal.columnPivotsLoading.set(true);

        pivots
          .then((res) => {
            if (controller.signal.aborted) return;

            sx.internal.columnPivotColumns.set(res);
            api.eventFire("onColumnPivotsResolved", { api, columns: res });
          })
          .catch((err) => {
            if (controller.signal.aborted) return;

            api.eventFire("onColumnPivotsRejected", { api, error: err });
          })
          .finally(() => {
            if (controller.signal.aborted) return;

            sx.internal.columnPivotsLoading.set(false);
            prevAbortController = null;
          });
      } else {
        sx.internal.columnPivotsLoading.set(false);
        sx.internal.columnPivotColumns.set(pivots);
        api.eventFire("onColumnPivotsResolved", { api, columns: pivots });
      }
    },
  } satisfies {
    columnPivotFieldFromData: ApiPro<D, E>["columnPivotFieldFromData"];
    columnPivotField: ApiPro<D, E>["columnPivotField"];
    columnPivotFilterModel: ApiPro<D, E>["columnPivotFilterModel"];
    columnPivotMeasureField: ApiPro<D, E>["columnPivotMeasureField"];
    columnPivots: ApiPro<D, E>["columnPivots"];
    columnPivotSetFilterModel: ApiPro<D, E>["columnPivotSetFilterModel"];
    columnPivotSetSortModel: ApiPro<D, E>["columnPivotSetSortModel"];
    columnPivotsLoading: ApiPro<D, E>["columnPivotsLoading"];
    columnPivotSortModel: ApiPro<D, E>["columnPivotSortModel"];
    columnPivotsReload: ApiPro<D, E>["columnPivotsReload"];
  };
};
