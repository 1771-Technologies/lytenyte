import type { PartialMandatory, RowSource } from "@1771technologies/lytenyte-shared";
import { createContext, useContext, type PropsWithChildren } from "react";
import type { Root } from "../root";
import { useYPositions } from "../hooks/use-y-positions.js";
import { useDimensionContext } from "./viewport/dimensions-context.js";
import { useHeaderLayoutContext } from "./header-layout.js";
import { useXPositions } from "../hooks/use-x-positions.js";
import { useColumnsContext } from "./columns/column-context.js";
import { useRowDetailContext } from "./state/row-detail.js";

const xCoordinates = createContext<Uint32Array>(null as unknown as Uint32Array);
const yCoordinates = createContext<Uint32Array>(null as unknown as Uint32Array);

type Picks =
  | "columnBase"
  | "columnSizeToFit"
  | "rowAutoHeightGuess"
  | "rowDetailAutoHeightGuess"
  | "rowDetailHeight"
  | "rowHeight";

type Props = Pick<PartialMandatory<Root.Props>, Picks> & { readonly source: RowSource };

export const CoordinatesProvider = (props: PropsWithChildren<Props>) => {
  const dimensions = useDimensionContext();
  const { view } = useColumnsContext();
  const { totalHeaderHeight } = useHeaderLayoutContext();
  const { detailExpansions, detailCache } = useRowDetailContext();

  const yPositions = useYPositions(
    props,
    props.source,
    dimensions.innerHeight - totalHeaderHeight,
    detailExpansions,
    detailCache,
  );
  const xPositions = useXPositions(props, view, dimensions.innerWidth);

  return (
    <xCoordinates.Provider value={xPositions}>
      <yCoordinates.Provider value={yPositions}>{props.children}</yCoordinates.Provider>
    </xCoordinates.Provider>
  );
};

export const useXCoordinates = () => useContext(xCoordinates);
export const useYCoordinates = () => useContext(yCoordinates);
