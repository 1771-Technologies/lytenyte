import type {
  PositionFullWidthRow,
  PositionGridCell,
  PositionUnion,
  RowAggregated,
  RowGroup,
  RowLeaf,
  RowNode,
  RowSource,
} from "@1771technologies/lytenyte-shared";
import type { Column } from "./column.js";
import type { GridSpec, VirtualTarget } from "./grid.js";
import type {
  Piece,
  useDraggable,
  UseDraggableProps,
} from "@1771technologies/lytenyte-core-experimental/internal";
import type { Props } from "./props.js";

type WithId = { readonly id: string };
type RowSourceOmits = "onRowGroupExpansionsChange" | "onRowsUpdated" | "onRowsSelected";

export interface DataRect {
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly columnStart: number;
  readonly columnEnd: number;
}

export interface ExportDataRectResult<Spec extends GridSpec = GridSpec> {
  readonly headers: string[];
  readonly groupHeaders: (string | null)[][];
  readonly data: unknown[][];
  readonly columns: Column<Spec>[];
}

export type API<Spec extends GridSpec = GridSpec> = {
  readonly dialogFrameOpen: (id: string, context?: any) => void;
  readonly dialogFrameClose: (id?: string) => void;
  readonly popoverFrameOpen: (id: string, target: HTMLElement | VirtualTarget, context?: any) => void;
  readonly popoverFrameClose: (id?: string) => void;
  readonly positionFromElement: (el: HTMLElement) => PositionUnion | null;

  // CORE Shared Properties
  readonly xPositions$: Piece<Uint32Array>;
  readonly yPositions$: Piece<Uint32Array>;
  readonly viewport$: Piece<HTMLElement | null>;

  readonly cellRoot: (row: number, column: number) => PositionGridCell | PositionFullWidthRow | null;
  readonly columnById: (id: string) => Column<Spec> | null;
  readonly columnByIndex: (index: number) => Column<Spec> | null;
  readonly columnField: (columnOrId: string | WithId, row: RowNode<Spec["data"]>) => unknown;
  readonly columnMove: (params: {
    readonly moveColumns: (string | WithId)[];
    readonly moveTarget: string | number | WithId;
    readonly before?: boolean;
    readonly updatePinState?: boolean;
  }) => void;
  readonly columnResize: (sizes: Record<string, number>) => void;
  readonly columnAutosize: (params?: {
    readonly dryRun?: boolean;
    readonly includeHeader?: boolean;
    readonly columns?: (string | number | WithId)[];
  }) => Record<string, number>;
  readonly columnUpdate: (updates: Record<string, Omit<Column<Spec>, "id">>) => void;
  readonly columnToggleGroup: (group: string | string[], state?: boolean) => void;

  readonly rowDetailHeight: (rowId: WithId | string) => number;
  readonly rowDetailExpanded: (rowOrId: RowNode<Spec["data"]> | string | number) => boolean;
  readonly rowDetailToggle: (rowOrId: string | RowNode<Spec["data"]>, state?: boolean) => void;

  readonly rowGroupToggle: (rowOrId: RowNode<Spec["data"]> | string, state?: boolean) => void;
  readonly rowIsLeaf: (row: RowNode<Spec["data"]>) => row is RowLeaf<Spec["data"]>;
  readonly rowIsGroup: (row: RowNode<Spec["data"]>) => row is RowGroup;
  readonly rowIsAggregated: (row: RowNode<Spec["data"]>) => row is RowAggregated;
  readonly rowIsExpanded: (row: RowNode<Spec["data"]>) => boolean;
  readonly rowIsExpandable: (row: RowNode<Spec["data"]>) => boolean;

  readonly exportData: (params?: {
    readonly rect: DataRect;
    readonly uniformGroupHeaders?: boolean;
  }) => Promise<ExportDataRectResult<Spec>>;

  readonly scrollIntoView: (params: {
    readonly column?: number | string | WithId;
    readonly row?: number;
    readonly behavior?: "smooth" | "auto" | "instant";
  }) => void;

  readonly viewport: () => HTMLElement | null;

  readonly editBegin: (params: {
    readonly init?: any;
    readonly column: WithId | string | number;
    readonly rowIndex: number;
    readonly focusIfNotEditable?: boolean;
  }) => void;
  readonly editEnd: (cancel?: boolean) => void;
  readonly editIsCellActive: (params: {
    readonly column: WithId | string | number;
    readonly rowIndex: number;
  }) => boolean;
  readonly editUpdate: (
    rows: Map<string | number, unknown>,
  ) => true | Map<string | number, boolean | Record<string, unknown>>;

  readonly rowSelect: (params: {
    readonly selected: string | [start: string, end: string] | Set<string> | "all";
    readonly deselect?: boolean;
  }) => void;
  readonly rowHandleSelect: (params: { readonly target: EventTarget; readonly shiftKey: boolean }) => void;

  readonly useRowDrag: (
    params: Partial<Pick<UseDraggableProps, "data" | "placeholder">> & { rowIndex: number },
  ) => ReturnType<typeof useDraggable>;

  readonly props: () => Props<Spec>;
} & Omit<RowSource, RowSourceOmits> &
  (undefined extends Spec["source"] ? object : Omit<Spec["source"], RowSourceOmits>) &
  Spec["api"];
