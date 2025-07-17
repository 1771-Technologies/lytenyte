import type { InterfaceType, PropertyType, UnionType } from "../+types";

const ColumnField: PropertyType = {
  kind: "property",
  name: "columnField",
  tsDoc: ``,
  value: "(columnOrId: string | Column<T>, row: FieldDataParam<T>) => unknown",
  doc: { en: `` },
  optional: false,
};

const ColumnFromIndex: PropertyType = {
  kind: "property",
  name: "columnFromIndex",
  value: "(columnIndex: number) => Column<T> | null",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
};

const ColumnIndex: PropertyType = {
  kind: "property",
  name: "columnIndex",
  value: "(columnOrId: string | Column<T>) => number",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
};

const SortForColumn: PropertyType = {
  kind: "property",
  name: "sortForColumn",
  tsDoc: ``,
  doc: { en: `` },
  value: "(columnOrId: string) => { sort: SortModelItem<T>, index: number } | null",
  optional: false,
};

const RowIsLeaf: PropertyType = {
  kind: "property",
  name: "rowIsLeaf",
  tsDoc: ``,
  doc: { en: `` },
  value: "(row: RowNode<T>) => row is RowLeaf<T>",
  optional: false,
};
const RowIsGroup: PropertyType = {
  kind: "property",
  name: "rowIsGroup",
  tsDoc: ``,
  doc: { en: `` },
  value: "(row: RowNode<T>) => row is RowGroup",
  optional: false,
};
const RowGroupColumnIndex: PropertyType = {
  kind: "property",
  name: "rowGroupColumnIndex",
  tsDoc: ``,
  doc: { en: `` },
  value: "(c: Column<T>) => number",
  optional: false,
};
const RowGroupToggleExpansion: PropertyType = {
  kind: "property",
  name: "rowGroupToggle",
  tsDoc: ``,
  doc: { en: `` },
  value: "(row: RowGroup, state?: boolean) => void",
  optional: false,
};
const RowGroupApplyExpansions: PropertyType = {
  kind: "property",
  name: "rowGroupApplyExpansions",
  tsDoc: ``,
  doc: { en: `` },
  value: "(expansions: Record<string, boolean>) => void",
  optional: false,
};
const RowGroupIsExpanded: PropertyType = {
  kind: "property",
  name: "rowGroupIsExpanded",
  tsDoc: ``,
  doc: { en: `` },
  value: "(row: RowGroup) => boolean",
  optional: false,
};

const EventAddListener: PropertyType = {
  kind: "property",
  name: "eventAddListener",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value:
    "<K extends keyof GridEvents<T>>(event: K, fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void) => () => void",
};

const EventRemoveListener: PropertyType = {
  kind: "property",
  name: "eventRemoveListener",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value:
    "<K extends keyof GridEvents<T>>(event: K, fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void) => void",
};
const EventFire: PropertyType = {
  kind: "property",
  name: "eventFire",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value:
    "<K extends keyof GridEvents<T>>(name: K, event: Parameters<Required<GridEvents<T>>[K]>[0]) => void",
};

export const ScrollIntoViewOptions: InterfaceType = {
  kind: "interface",
  name: "ScrollIntoViewOptions<T>",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  properties: [
    {
      kind: "property",
      name: "column",
      value: "number | string | Column<T>",
      doc: { en: `` },
      optional: true,
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "row",
      value: "number",
      doc: { en: `` },
      optional: true,
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "behavior",
      value: '"smooth" | "auto" | "instant"',
      doc: { en: `` },
      tsDoc: ``,
      optional: true,
    },
  ],
};

const ScrollIntoView: PropertyType = {
  kind: "property",
  name: "scrollIntoView",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "(options: ScrollIntoViewOptions<T>) => void",
};

export const FocusCellParams: UnionType = {
  kind: "union",
  doc: { en: `` },
  export: true,
  name: "FocusCellParams<T>",
  tsDoc: ``,
  types: [
    "{ row: number, column: string | number | Column<T> }",
    "PositionHeaderCell",
    'Omit<PositionHeaderGroupCell, "columnStartIndex" | "columnEndIndex">',
    '"next"',
    '"prev"',
    '"up"',
    '"down"',
  ],
};

const FocusCell: PropertyType = {
  kind: "property",
  name: "focusCell",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: `(position: FocusCellParams<T>) => void`,
};

const EditBegin: PropertyType = {
  kind: "property",
  name: "editBegin",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: `(params: EditBeginParams<T>) => void`,
};
const EditEnd: PropertyType = {
  kind: "property",
  name: "editEnd",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: `(cancel?: boolean) => void`,
};

const EditIsCellActive: PropertyType = {
  kind: "property",
  name: "editIsCellActive",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: `(params: EditBeginParams<T>) => boolean`,
};

const EditUpdate: PropertyType = {
  kind: "property",
  name: "editUpdate",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: `(params: EditUpdateParams<T>) => void`,
};

const RowDetailIsExpanded: PropertyType = {
  kind: "property",
  name: "rowDetailIsExpanded",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "(rowOrId: string | RowNode<T>) => boolean",
};
const RowDetailToggle: PropertyType = {
  kind: "property",
  name: "rowDetailToggle",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "(rowOrId: string | RowNode<T>, state?: boolean) => void",
};
const RowDetailRenderedHeight: PropertyType = {
  kind: "property",
  name: "rowDetailRenderedHeight",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "(rowOrId: string | RowNode<T>) => number",
};

const RowById: PropertyType = {
  kind: "property",
  name: "rowById",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "(id: string) => RowNode<T> | null | undefined",
};
const RowByIndex: PropertyType = {
  kind: "property",
  name: "rowByIndex",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "(index: number, section?: RowSection) => RowNode<T> | null | undefined",
};

const RowSelect: PropertyType = {
  kind: "property",
  name: "rowSelect",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "(params: RowSelectOptions) => void",
};
const RowSelectAll: PropertyType = {
  kind: "property",
  name: "rowSelectAll",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "(params?: RowSelectAllOptions) => void",
};
const RowSelected: PropertyType = {
  kind: "property",
  name: "rowSelected",
  doc: { en: `` },
  tsDoc: ``,
  optional: false,
  value: "() => RowNode<T>[]",
};

export const HandleSelectionParams: InterfaceType = {
  kind: "interface",
  name: "RowHandleSelect",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "target",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "EventTarget",
    },
    {
      kind: "property",
      name: "shiftKey",
      tsDoc: ``,
      doc: { en: `` },
      optional: false,
      value: "boolean",
    },
  ],
};

const RowHandleSelect: PropertyType = {
  kind: "property",
  name: "rowHandleSelect",
  value: "(params: RowHandleSelect) => void",
  doc: { en: `` },
  optional: false,
  tsDoc: ``,
};

const UseRowDragProps: PropertyType = {
  kind: "property",
  name: "useRowDrag",
  doc: { en: `` },
  tsDoc: ``,
  value: "(params: UseRowDragParams<T>) => { dragProps: any, isDragging: boolean }",
  optional: false,
};

const ResizeColumn: PropertyType = {
  kind: "property",
  name: "columnResize",
  doc: { en: `` },
  tsDoc: ``,
  value: "(columns: Record<string, number>) => void",
  optional: false,
};

const ColumnById: PropertyType = {
  kind: "property",
  name: "columnById",
  doc: { en: `` },
  tsDoc: ``,
  value: "(id: string) => Column<T> | undefined",
  optional: false,
};
const ColumnUpdates: PropertyType = {
  kind: "property",
  name: "columnUpdate",
  doc: { en: `` },
  tsDoc: ``,
  value: "(updates: Record<string, Omit<Column<T>, 'id'>>) => void",
  optional: false,
};

export const ColumnMoveParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: ``,
  export: true,
  name: "ColumnMoveParams<T>",
  properties: [
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "moveColumns",
      value: "(string | Column<T>)[]",
      optional: false,
    },
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "moveTarget",
      optional: false,
      value: "string | number | Column<T>",
    },
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "before",
      optional: true,
      value: "boolean",
    },
    {
      kind: "property",
      tsDoc: ``,
      doc: { en: `` },
      name: "updatePinState",
      optional: true,
      value: "boolean",
    },
  ],
};

const ColumnMove: PropertyType = {
  kind: "property",
  name: "columnMove",
  doc: { en: `` },
  optional: false,
  tsDoc: ``,
  value: "(params: ColumnMoveParams<T>) => void",
};

const HeaderGroupToggle: PropertyType = {
  kind: "property",
  name: "columnToggleGroup",
  doc: { en: `` },
  optional: false,
  tsDoc: ``,
  value: "(group: string | string[], state?: boolean) => void",
};

export const ColumnAutosizeParams: InterfaceType = {
  kind: "interface",
  name: "ColumnAutosizeParams<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      name: "dryRun",
      value: "boolean",
      optional: true,
      doc: { en: `` },
      tsDoc: ``,
    },
    {
      kind: "property",
      name: "includeHeader",
      value: "boolean",
      optional: true,
      doc: { en: `` },
      tsDoc: ``,
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "columns",
      optional: true,
      tsDoc: ``,
      value: "(string | number | Column<T>)[]",
    },
  ],
};

const ColumnAutosize: PropertyType = {
  kind: "property",
  name: "columnAutosize",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "(params: ColumnAutosizeParams<T>) => Record<string, number>",
};

export const ExportDataRect: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "exportDataRect",
  optional: false,
  tsDoc: ``,
  value: "(params?: ExportDataRectParams) => ExportDataRectResult<T>",
};
export const ExportCsv: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "exportCsv",
  optional: false,
  tsDoc: ``,
  value: "(params?: ExportCsvParams) => Promise<string>",
};
export const ExportCsvFile: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "exportCsvFile",
  optional: false,
  tsDoc: ``,
  value: "(params?: ExportCsvParams) => Promise<Blob>",
};

export const GridApi: InterfaceType = {
  kind: "interface",
  name: "GridApi<T>",
  tsDoc: ``,
  doc: { en: `` },
  export: true,
  properties: [
    ColumnField,
    ColumnFromIndex,
    ColumnIndex,

    SortForColumn,
    RowIsLeaf,
    RowIsGroup,
    RowGroupColumnIndex,
    RowGroupToggleExpansion,
    RowGroupApplyExpansions,
    RowGroupIsExpanded,

    EventAddListener,
    EventRemoveListener,
    EventFire,

    ScrollIntoView,

    FocusCell,
    EditBegin,
    EditEnd,
    EditIsCellActive,
    EditUpdate,

    RowDetailIsExpanded,
    RowDetailToggle,
    RowDetailRenderedHeight,

    RowById,
    RowByIndex,

    RowSelect,
    RowSelectAll,
    RowSelected,
    RowHandleSelect,

    UseRowDragProps,
    ResizeColumn,
    ColumnById,
    ColumnUpdates,
    ColumnMove,

    HeaderGroupToggle,
    ColumnAutosize,

    ExportDataRect,
    ExportCsv,
    ExportCsvFile,
  ],
};
