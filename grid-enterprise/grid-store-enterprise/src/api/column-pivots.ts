import { columnFieldComputer, columnGetField } from "@1771technologies/grid-shared-state";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import { isPromise } from "@1771technologies/js-utils";

export const columnPivots = <D, E>(
  api: ApiEnterprise<D, E>,
): {
  columnPivotFieldFromData: ApiEnterprise<D, E>["columnPivotFieldFromData"];
  columnPivotField: ApiEnterprise<D, E>["columnPivotField"];
  columnPivotFilterModel: ApiEnterprise<D, E>["columnPivotFilterModel"];
  columnPivotMeasureField: ApiEnterprise<D, E>["columnPivotMeasureField"];
  columnPivots: ApiEnterprise<D, E>["columnPivots"];
  columnPivotSetFilterModel: ApiEnterprise<D, E>["columnPivotSetFilterModel"];
  columnPivotSetSortModel: ApiEnterprise<D, E>["columnPivotSetSortModel"];
  columnPivotsLoading: ApiEnterprise<D, E>["columnPivotsLoading"];
  columnPivotSortModel: ApiEnterprise<D, E>["columnPivotSortModel"];
  columnPivotsReload: ApiEnterprise<D, E>["columnPivotsReload"];
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
    columnPivotFieldFromData: ApiEnterprise<D, E>["columnPivotFieldFromData"];
    columnPivotField: ApiEnterprise<D, E>["columnPivotField"];
    columnPivotFilterModel: ApiEnterprise<D, E>["columnPivotFilterModel"];
    columnPivotMeasureField: ApiEnterprise<D, E>["columnPivotMeasureField"];
    columnPivots: ApiEnterprise<D, E>["columnPivots"];
    columnPivotSetFilterModel: ApiEnterprise<D, E>["columnPivotSetFilterModel"];
    columnPivotSetSortModel: ApiEnterprise<D, E>["columnPivotSetSortModel"];
    columnPivotsLoading: ApiEnterprise<D, E>["columnPivotsLoading"];
    columnPivotSortModel: ApiEnterprise<D, E>["columnPivotSortModel"];
    columnPivotsReload: ApiEnterprise<D, E>["columnPivotsReload"];
  };
};
