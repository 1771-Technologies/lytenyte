import type { RowNodeLeafPro, RowNodeTotalPro } from "@1771technologies/grid-types/pro";
import type { ServerState } from "../create-server-data-source";
import type { AsyncDataResponse } from "../types";
import { ROW_LEAF_KIND, ROW_TOTAL_ID, ROW_TOTAL_KIND } from "@1771technologies/grid-constants";

export function handleTopBlock<D, E>(payload: AsyncDataResponse, state: ServerState<D, E>) {
  if (!payload.topBlock) return;

  const lookup = state.blockLoadTimeLookup.peek();

  const key = "lng-rows-top";
  const loadTime = lookup.get(key) ?? 0;

  if (loadTime > payload.reqTime) return;

  const datum = payload.topBlock.frame.data;
  const ids = payload.topBlock.frame.ids;

  const nodes = datum.map<RowNodeLeafPro<D>>((data, i) => {
    return {
      id: ids[i],
      data: data as D,
      kind: ROW_LEAF_KIND,
      rowIndex: i,
      rowPin: "top",
    };
  });

  state.graph.setTop(nodes);
  lookup.set(key, payload.reqTime);
}

export function handleBottomBlock<D, E>(payload: AsyncDataResponse, state: ServerState<D, E>) {
  if (!payload.bottomBlock) return;

  const lookup = state.blockLoadTimeLookup.peek();

  const key = "lng-rows-bottom";
  const loadTime = lookup.get(key) ?? 0;

  if (loadTime > payload.reqTime) return;

  const datum = payload.bottomBlock.frame.data;
  const ids = payload.bottomBlock.frame.ids;

  const nodes = datum.map<RowNodeLeafPro<D>>((data, i) => {
    return {
      id: ids[i],
      data: data as D,
      kind: ROW_LEAF_KIND,
      rowIndex: i,
      rowPin: "bottom",
    };
  });

  state.graph.setBottom(nodes);
  lookup.set(key, payload.reqTime);
}

export function handleTotalBlock<D, E>(payload: AsyncDataResponse, state: ServerState<D, E>) {
  if (!payload.totalBlock) return;

  const lookup = state.blockLoadTimeLookup.peek();

  const key = "lng-row-total";
  const loadTime = lookup.get(key) ?? 0;

  if (loadTime > payload.reqTime) return;

  const node: RowNodeTotalPro = {
    id: ROW_TOTAL_ID,
    kind: ROW_TOTAL_KIND,
    data: payload.totalBlock.frame.data as Record<string, unknown>,
    rowIndex: null,
    rowPin: null,
  };

  state.graph.setTotal(node);
  lookup.set(key, payload.reqTime);
}
