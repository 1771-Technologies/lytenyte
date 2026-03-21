import { createContext, useContext } from "react";

export interface CountsContext {
  /** The number of rows in the grid. This is based on the row source provided. */
  readonly rowCount: number;
  /** The count of the top rows. Top rows will be pinned to the top of the viewport. */
  readonly topCount: number;
  /** The count of the center rows. This will be rowCount - topCount - bottomCount. */
  readonly centerCount: number;
  /** The count of the bottom rows. Bottoms rows will be pinned to the bottom of the viewport. */
  readonly bottomCount: number;
  /** The count of the columns pinned to the start of the viewport. */
  readonly startCount: number;
  /** The count of the columns pinned to the end of the viewport.  */
  readonly endCount: number;
  /** The count of the columns that are not pinned. */
  readonly colCenterCount: number;

  /** The first index that is not pinned to the top of the grid. This is essentially the first scrollable row. */
  readonly topCutoff: number;
  /** The index of the first bottom row. This is one value passed the last scrollable row. */
  readonly bottomCutoff: number;
  /** The index of the first scrollable column. This is where the start columns end. */
  readonly startCutoff: number;
  /** The index of the first end column. This is where the scrollable columns end. */
  readonly endCutoff: number;

  /**
   * The height in px of the scrollable rows from the top of the viewport. This is essentially the
   * top pinned row height + total header height.
   */
  readonly topOffset: number;
  /**
   * The height of the bottom pinned rows.
   */
  readonly bottomOffset: number;
  /**
   * The width of the start pinned columns.
   */
  readonly startOffset: number;
  /**
   * The width of the end pinned columns.
   */
  readonly endOffset: number;
}

const context = createContext<CountsContext>({} as any);

export const CutoffProvider = context.Provider;
export const useCutoffs = () => useContext(context);
