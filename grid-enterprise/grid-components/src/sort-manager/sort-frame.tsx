import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { SortManager } from "./sort-manager";
import type { FloatingFrameReact } from "@1771technologies/grid-types/enterprise-react";
import { useMemo } from "react";

export interface SortFrameProps<D> {
  readonly grid: StoreEnterpriseReact<D>;
}

export function SortFloatingFrame<D>({ api }: Parameters<FloatingFrameReact<D>["component"]>[0]) {
  const state = api.getState();
  const grid = useMemo(() => {
    return { api, state };
  }, [api, state]);

  return (
    <>
      <SortManager grid={grid} />
    </>
  );
}
