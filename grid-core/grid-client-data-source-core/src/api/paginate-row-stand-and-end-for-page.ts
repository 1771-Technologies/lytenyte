import type { ClientState } from "../create-client-data-source";
import { paginateGetCount } from "./paginate-get-count";

export function paginateRowStartAndEndForPage<D, E>(
  state: ClientState<D, E>,
  page: number,
): [number, number] {
  const pageCount = paginateGetCount(state);

  if (page > pageCount) {
    throw new Error(`There are only ${pageCount} pages, but page ${page} was requested`);
  }

  const graph = state.graph.peek();
  const topCount = graph.rowTopCount();
  const bottomCount = graph.rowBotCount();
  const rowCount = graph.rowCount();

  const api = state.api.peek();
  const sx = api.getState();

  const pageOffset = sx.paginatePageSize.peek();

  const startIndex = page * pageOffset + topCount;
  const endIndex = Math.min(startIndex + pageOffset, rowCount - bottomCount);

  return [startIndex, endIndex];
}
