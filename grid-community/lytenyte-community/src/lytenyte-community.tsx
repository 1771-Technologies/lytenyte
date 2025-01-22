import type { StoreCommunityReact } from "@1771technologies/grid-types";
import { GridProvider } from "./use-grid";
import { Viewport } from "./renderer/viewport";
import { HeaderCellDefault } from "./header/header-renderers/header-cell-default";

export interface LyteNyteGridCommunityProps<D> {
  readonly grid: StoreCommunityReact<D>;
}

export function LyteNyteGridCommunity<D>({ grid }: LyteNyteGridCommunityProps<D>) {
  return (
    <GridProvider value={grid}>
      <LyteNyteCommunityImpl />
    </GridProvider>
  );
}

function LyteNyteCommunityImpl() {
  return <Viewport headerDefault={HeaderCellDefault} />;
}
