/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
} from "react";
import type { API, Props, RowHeight } from "../types/types-internal.js";
import { useViewportDimensions } from "./hooks/use-viewport-dimensions.js";
import { useControlledGridState } from "./hooks/use-controlled-grid-state.js";
import { useColumnView } from "./hooks/use-column-view.js";
import { DEFAULT_ROW_SOURCE } from "./constants.js";
import { useTotalHeaderHeight } from "./hooks/use-total-header-height.js";
import { useXPositions } from "./hooks/use-x-positions.js";
import { useYPositions } from "./hooks/use-y-positions.js";
import { useHeaderLayout } from "./hooks/use-header-layout.js";
import type {
  ColumnAbstract,
  LayoutState,
  PositionFullWidthRow,
  PositionGridCell,
  PositionUnion,
  RowGroupDisplayMode,
  RowNode,
  RowSource,
} from "@1771technologies/lytenyte-shared";
import { useRowLayout } from "./hooks/use-row-layout/use-row-layout.js";
import { useBounds } from "./hooks/use-bounds.js";
import { useApi } from "./hooks/use-api/use-api.js";
import {
  BoundsContextProvider,
  ColumnLayoutContextProvider,
  RootContextProvider,
  RowLayoutContextProvider,
  type RootContextValue,
} from "./root-context.js";
import { usePiece } from "../hooks/use-piece.js";

export const Root = <
  Data = unknown,
  ColExt extends Record<string, unknown> = {},
  Source extends RowSource = RowSource,
  Ext extends Record<string, unknown> = {},
>({
  children,
  ...p
}: PropsWithChildren<Root.Props<Data, ColExt, Source, Ext>>) => {
  const props = p as unknown as Props;
  const source = props.rowSource ?? DEFAULT_ROW_SOURCE;

  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const id = useId();

  const dimensions = useViewportDimensions(vp);
  const controlled = useControlledGridState(props);

  const view = useColumnView(props, source, controlled.columnGroupExpansions);
  const totalHeaderHeight = useTotalHeaderHeight(props, view.maxRow);

  const xPositions = useXPositions(props, view, dimensions.innerWidth);
  const yPositions = useYPositions(
    props,
    source,
    dimensions.innerHeight - totalHeaderHeight,
    controlled.detailExpansions,
  );

  const api = useRef<API>({} as any);
  useImperativeHandle(props.ref, () => api.current as any, []);

  const bounds = useBounds(
    props,
    source,
    view,
    vp,
    dimensions.innerWidth,
    dimensions.innerHeight,
    xPositions,
    yPositions.positions,
  );

  const layoutStateRef = useRef<LayoutState>(null as unknown as LayoutState);
  const headerLayout = useHeaderLayout(view, props);
  const rowLayout = useRowLayout(
    props,
    source,
    view,
    vp,
    api.current,
    bounds,
    layoutStateRef,
    controlled.detailExpansions,
  );

  useApi(
    props,
    source,
    view,
    layoutStateRef,
    controlled.detailExpansions,
    yPositions.detailCache,
    vp,
    xPositions,
    yPositions.positions,
    totalHeaderHeight,
    api.current,
  );

  const [position, setPosition] = useState<PositionUnion | null>(null);
  const focusPiece = usePiece(position, setPosition);

  const value = useMemo<RootContextValue>(() => {
    return {
      id: props.gridId ?? id,
      rtl: props.rtl ?? false,
      api: api.current,
      xPositions,
      yPositions: yPositions.positions,
      setViewport: setVp,
      view,
      focusActive: focusPiece,
      source,

      dimensions,

      totalHeaderHeight,
      detailExpansions: controlled.detailExpansions,

      rowDetailHeight: props.rowDetailHeight ?? 200,
      rowDetailRenderer: props.rowDetailRenderer,
      rowFullWidthRenderer: props.rowFullWidthRenderer,
      setDetailCache: yPositions.setDetailCache,

      base: props.columnBase ?? {},

      columnGroupDefaultExpansion: props.columnGroupDefaultExpansion ?? true,
      columnGroupExpansions: controlled.columnGroupExpansions,

      floatingRowEnabled: props.floatingRowEnabled ?? false,
      floatingRowHeight: props.floatingRowHeight ?? 40,
      headerGroupHeight: props.headerGroupHeight ?? 40,
      headerHeight: props.headerHeight ?? 40,
    };
  }, [
    controlled.columnGroupExpansions,
    controlled.detailExpansions,
    dimensions,
    focusPiece,
    id,
    props.columnBase,
    props.columnGroupDefaultExpansion,
    props.floatingRowEnabled,
    props.floatingRowHeight,
    props.gridId,
    props.headerGroupHeight,
    props.headerHeight,
    props.rowDetailHeight,
    props.rowDetailRenderer,
    props.rowFullWidthRenderer,
    props.rtl,
    source,
    totalHeaderHeight,
    view,
    xPositions,
    yPositions.positions,
    yPositions.setDetailCache,
  ]);

  return (
    <RootContextProvider value={value}>
      <RowLayoutContextProvider value={rowLayout}>
        <ColumnLayoutContextProvider value={headerLayout}>
          <BoundsContextProvider value={bounds}>{children}</BoundsContextProvider>
        </ColumnLayoutContextProvider>
      </RowLayoutContextProvider>
    </RootContextProvider>
  );
};

export namespace Root {
  type WithId = { readonly id: string };

  export type PathField = { kind: "path"; path: string };

  export interface RowParams<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > {
    readonly rowIndex: number;
    readonly row: RowNode<T>;
    readonly api: API<T, ColExt, S, Ext>;
  }

  export interface HeaderParams<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > {
    readonly column: Column<T, ColExt, S, Ext>;
    readonly api: API<T, ColExt, S, Ext>;
  }

  export interface CellParams<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > {
    readonly row: RowNode<T>;
    readonly column: Column<T, ColExt, S, Ext>;
    readonly api: API<T, ColExt, S, Ext>;
  }

  export interface CellParamsWithIndex<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > extends CellParams<T, ColExt, S, Ext> {
    readonly rowIndex: number;
    readonly colIndex: number;
  }

  export interface Renderers<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > {
    readonly header: (props: HeaderParams<T, ColExt, S, Ext>) => ReactNode;
    readonly cell: (props: CellParamsWithIndex<T, ColExt, S, Ext>) => ReactNode;
    readonly row: (props: RowParams<T, ColExt, S, Ext>) => ReactNode;
  }

  export type API<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > = {
    readonly cellRoot: (row: number, column: number) => PositionGridCell | PositionFullWidthRow | null;
    readonly columnById: (id: string) => Column<T, ColExt, S, Ext> | null;
    readonly columnField: (columnOrId: string | WithId, row: RowNode<T>) => unknown;

    readonly rowDetailHeight: (rowId: WithId | string) => number;
    readonly rowDetailExpanded: (rowOrId: RowNode<T> | string | number) => boolean;

    readonly rowGroupToggle: (rowOrId: RowNode<T> | string, state?: boolean) => void;

    readonly scrollIntoView: (params: {
      readonly column?: number | string | WithId;
      readonly row?: number;
      readonly behavior?: "smooth" | "auto" | "instant";
    }) => void;

    readonly props: () => Props<T, ColExt, S, Ext>;
  } & S &
    Ext;

  interface ColumnUnextended<
    T,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > extends ColumnAbstract {
    readonly field?: string | number | PathField | ((params: CellParams<T, ColExt, S, Ext>) => unknown);

    readonly colSpan?: number | ((params: CellParamsWithIndex<T, ColExt, S, Ext>) => number);
    readonly rowSpan?: number | ((params: CellParamsWithIndex<T, ColExt, S, Ext>) => number);

    readonly autosizeCellFn?: (params: CellParams<T, ColExt, S, Ext>) => number | null | undefined;
    readonly autosizeHeaderFn?: (
      params: HeaderParams<this & ColExt, API<T, ColExt, S, Ext>>,
    ) => number | null | undefined;

    readonly floatingCellRenderer?: Renderers<T, ColExt, S, Ext>["header"];
    readonly headerRenderer?: Renderers<T, ColExt, S, Ext>["header"];
    readonly cellRenderer?: Renderers<T, ColExt, S, Ext>["cell"];
    readonly editRenderer?: Renderers<T, ColExt, S, Ext>["cell"];
  }

  export type Column<
    T = unknown,
    ColExt extends Record<string, unknown> = {},
    S extends RowSource<T> = RowSource,
    Ext extends Record<string, unknown> = {},
  > = ColumnUnextended<T, ColExt, S, Ext> & ColExt;

  export type Props<
    Data = unknown,
    ColExt extends Record<string, any> = object,
    S extends RowSource<Data> = RowSource,
    Ext extends Record<string, any> = object,
  > = {
    readonly columns?: Column<Data, ColExt, S, Ext>[];
    readonly columnBase?: Omit<Column<Data, ColExt, S, Ext>, "pin" | "field">;
    readonly columnMarker?: Omit<Column<Data, ColExt, S, Ext>, "field"> & { width?: number };

    readonly columnMarkerEnabled?: boolean;
    readonly columnGroupDefaultExpansion?: boolean;
    readonly columnGroupExpansions?: Record<string, boolean>;
    readonly columnGroupJoinDelimiter?: string;
    readonly columnSizeToFit?: boolean;
    readonly columnDoubleClickToAutosize?: boolean;

    readonly gridId?: string;

    readonly rtl?: boolean;

    readonly headerHeight?: number;
    readonly headerGroupHeight?: number;
    readonly floatingRowHeight?: number;
    readonly floatingRowEnabled?: boolean;

    readonly rowOverscanTop?: number;
    readonly rowOverscanBottom?: number;

    readonly colOverscanStart?: number;
    readonly colOverscanEnd?: number;

    readonly rowScanDistance?: number;
    readonly rowSource?: S;
    readonly rowHeight?: RowHeight;
    readonly rowAutoHeightGuess?: number;

    readonly rowGroupColumn?: Omit<Column<Data, ColExt, S, Ext>, "field" | "id">;
    readonly rowGroupDisplayMode?: RowGroupDisplayMode;

    readonly rowFullWidthPredicate?:
      | null
      | ((params: RowParams<RowNode<Data>, API<Data, ColExt, S, Ext>>) => boolean);
    readonly rowFullWidthRenderer?: Renderers<Data, ColExt, S, Ext>["row"] | null;

    readonly virtualizeCols?: boolean;
    readonly virtualizeRows?: boolean;

    readonly rowSelectionMode?: "single" | "multiple" | "none";
    readonly rowSelectionActivator?: "single-click" | "double-click" | "none";
    readonly rowSelectChildren?: boolean;

    readonly rowDetailExpansions?: Set<string>;
    readonly rowDetailHeight?: number | "auto";
    readonly rowDetailAutoHeightGuess?: number;
    readonly rowDetailRenderer?: Renderers<Data, ColExt, S, Ext>["row"] | null;

    readonly ref?: Ref<API<Data, ColExt, S, Ext>>;

    readonly editRowValidatorFn?: any;
    readonly editClickActivator?: "single" | "double-click" | "none";
    readonly editCellMode?: "cell" | "readonly";

    // Values that can be changed by the grid
    readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
    readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;
    readonly onRowGroupExpansionChange?: (deltaChange: Record<string, boolean>) => void;
  };
}
