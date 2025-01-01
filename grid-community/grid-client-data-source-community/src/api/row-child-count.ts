import type { ClientState } from "../create-client-data-source";

export function rowChildCount<D, E>(state: ClientState<D, E>, r: number) {
  const graph = state.graph.peek();

  return graph.rowChildCount(r);
}
