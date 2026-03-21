import { createContext, useContext } from "react";

export interface GridSections {
  /** Total number of rows provided by the row source. */
  readonly rowCount: number;
  /** Number of rows pinned to the top of the viewport. */
  readonly topCount: number;
  /** Number of scrollable rows. Equals rowCount − topCount − bottomCount. */
  readonly centerCount: number;
  /** Number of rows pinned to the bottom of the viewport. */
  readonly bottomCount: number;
  /** Number of columns pinned to the start edge of the viewport. */
  readonly startCount: number;
  /** Number of columns pinned to the end edge of the viewport. */
  readonly endCount: number;
  /** Number of scrollable (unpinned) columns. */
  readonly colCenterCount: number;

  /** Row index of the first scrollable row — where top-pinned rows end. */
  readonly topCutoff: number;
  /** Row index of the first bottom-pinned row — where scrollable rows end. */
  readonly bottomCutoff: number;
  /** Column index of the first scrollable column — where start-pinned columns end. */
  readonly startCutoff: number;
  /** Column index of the first end-pinned column — where scrollable columns end. */
  readonly endCutoff: number;

  /**
   * Pixel distance from the top of the viewport to the first scrollable row.
   * Includes the total header height plus the height of all top-pinned rows.
   */
  readonly topOffset: number;
  /** Pixel height of the bottom-pinned row area. */
  readonly bottomOffset: number;
  /** Pixel width of the start-pinned column area. */
  readonly startOffset: number;
  /** Pixel width of the end-pinned column area. */
  readonly endOffset: number;
}

const context = createContext<GridSections>({} as any);

export const GridSectionsProvider = context.Provider;
export const useGridSections = () => useContext(context);
