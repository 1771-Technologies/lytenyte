import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { Viewport } from "@1771technologies/lytenyte-grid-community/internal";
import { GridProvider } from "./use-grid";

export interface LyteNyteGridEnterpriseProps<D> {
  readonly grid: StoreEnterpriseReact<D>;
}

export function LyteNyteGrid<D>({ grid }: LyteNyteGridEnterpriseProps<D>) {
  return (
    <GridProvider value={grid}>
      <LyteNyteCommunityImpl />
    </GridProvider>
  );
}

function LyteNyteCommunityImpl() {
  return <Viewport />;
}
