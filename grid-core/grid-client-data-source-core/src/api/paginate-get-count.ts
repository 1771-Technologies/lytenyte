import type { ClientState } from "../create-client-data-source";

export function paginateGetCount<D, E>(state: ClientState<D, E>) {
  const graph = state.graph.peek();
  const api = state.api.peek();
  const sx = api.getState();

  const pageSize = sx.paginatePageSize.peek();

  const flatCount = graph.rowCount() - graph.rowTopCount() - graph.rowBotCount();

  const pageCount = Math.ceil(flatCount / pageSize);
  return pageCount;
}
