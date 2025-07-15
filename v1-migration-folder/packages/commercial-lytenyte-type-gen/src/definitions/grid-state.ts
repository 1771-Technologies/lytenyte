import type { InterfaceType, PropertyType } from "../+types.js";

/**
 * Grid State
 */
const Columns: PropertyType = {
  kind: "property",
  name: "columns",
  optional: false,
  value: "GridAtom<Column<T>[]>",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnBase: PropertyType = {
  kind: "property",
  name: "columnBase",
  optional: false,
  value: "GridAtom<ColumnBase<T>>",
  tsDoc: ``,
  doc: { en: `` },
};

const GridId: PropertyType = {
  kind: "property",
  name: "gridId",
  optional: false,
  value: "GridAtom<string>",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnSizeToFit: PropertyType = {
  kind: "property",
  name: "columnSizeToFit",
  optional: false,
  value: "GridAtom<boolean>",
  tsDoc: ``,
  doc: { en: `` },
};

const Viewport: PropertyType = {
  kind: "property",
  name: "viewport",
  optional: false,
  value: "GridAtom<HTMLElement | null>",
  tsDoc: ``,
  doc: { en: `` },
};

const ViewportWidthInner: PropertyType = {
  kind: "property",
  name: "viewportWidthInner",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};
const ViewportHeightInner: PropertyType = {
  kind: "property",
  name: "viewportHeightInner",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};
const ViewportWidthOuter: PropertyType = {
  kind: "property",
  name: "viewportWidthOuter",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};
const ViewportHeightOuter: PropertyType = {
  kind: "property",
  name: "viewportHeightOuter",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};

const HeaderHeight: PropertyType = {
  kind: "property",
  name: "headerHeight",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};
const HeaderGroupHeight: PropertyType = {
  kind: "property",
  name: "headerGroupHeight",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};

const XPositions: PropertyType = {
  kind: "property",
  name: "xPositions",
  optional: false,
  value: "GridAtomReadonly<Uint32Array>",
  tsDoc: ``,
  doc: { en: `` },
};

const WidthTotal: PropertyType = {
  kind: "property",
  name: "widthTotal",
  optional: false,
  value: "GridAtomReadonly<number>",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnGroupExpansions: PropertyType = {
  kind: "property",
  name: "columnGroupExpansions",
  optional: false,
  value: "GridAtom<Record<string, boolean>>",
  tsDoc: ``,
  doc: { en: `` },
};
const ColumnGroupDefaultExpansion: PropertyType = {
  kind: "property",
  name: "columnGroupDefaultExpansion",
  optional: false,
  value: "GridAtom<boolean>",
  tsDoc: ``,
  doc: { en: `` },
};
const ColumnGroupJoinDelimiter: PropertyType = {
  kind: "property",
  name: "columnGroupJoinDelimiter",
  optional: false,
  value: "GridAtom<string>",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnGroupMeta: PropertyType = {
  kind: "property",
  name: "columnGroupMeta",
  optional: false,
  value: "GridAtomReadonly<ColumnGroupMeta>",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnMeta: PropertyType = {
  kind: "property",
  name: "columnMeta",
  optional: false,
  value: "GridAtomReadonly<ColumnMeta<T>>",
  tsDoc: ``,
  doc: { en: `` },
};

const RowDataStore: PropertyType = {
  kind: "property",
  name: "rowDataStore",
  optional: false,
  value: "RowDataStore<T>",
  tsDoc: ``,
  doc: { en: `` },
};
const RowDataSource: PropertyType = {
  kind: "property",
  name: "rowDataSource",
  optional: false,
  value: "GridAtom<RowDataSource<T>>",
  tsDoc: ``,
  doc: { en: `` },
};

const YPositions: PropertyType = {
  kind: "property",
  name: "yPositions",
  optional: false,
  value: "GridAtomReadonly<Uint32Array>",
  tsDoc: ``,
  doc: { en: `` },
};
const HeightTotal: PropertyType = {
  kind: "property",
  name: "heightTotal",
  optional: false,
  value: "GridAtomReadonly<number>",
  tsDoc: ``,
  doc: { en: `` },
};

const RowAutoHeightGuess: PropertyType = {
  kind: "property",
  name: "rowAutoHeightGuess",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};
const RowHeight: PropertyType = {
  kind: "property",
  name: "rowHeight",
  optional: false,
  value: "GridAtom<RowHeight>",
  doc: { en: `` },
  tsDoc: ``,
};

const RowScanDistance: PropertyType = {
  kind: "property",
  name: "rowScanDistance",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};

const ColScanDistance: PropertyType = {
  kind: "property",
  name: "colScanDistance",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};

const RowOverscanTop: PropertyType = {
  kind: "property",
  name: "rowOverscanTop",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};
const RowOverscanBottom: PropertyType = {
  kind: "property",
  name: "rowOverscanBottom",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};
const ColOverscanStart: PropertyType = {
  kind: "property",
  name: "colOverscanStart",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};
const ColOverscanEnd: PropertyType = {
  kind: "property",
  name: "colOverscanEnd",
  optional: false,
  value: "GridAtom<number>",
  tsDoc: ``,
  doc: { en: `` },
};

const RowFullWidthPredicate: PropertyType = {
  kind: "property",
  name: "rowFullWidthPredicate",
  optional: false,
  value: "GridAtom<{ fn: RowFullWidthPredicate<T>}>",
  tsDoc: ``,
  doc: { en: `` },
};

const RowFullWidthRenderer: PropertyType = {
  kind: "property",
  doc: { en: `` },
  tsDoc: ``,
  name: "rowFullWidthRenderer",
  optional: false,
  value: "GridAtom<{ fn: RowFullWidthRendererFn<T> }>",
};

const CellRenderers: PropertyType = {
  kind: "property",
  name: "cellRenderers",
  optional: false,
  value: "GridAtom<Record<string, CellRendererFn<T>>>",
  tsDoc: ``,
  doc: { en: `` },
};

const SortModel: PropertyType = {
  kind: "property",
  name: "sortModel",
  optional: false,
  tsDoc: ``,
  doc: { en: `` },
  value: "GridAtom<SortModelItem<T>[]>",
};

const Rtl: PropertyType = {
  kind: "property",
  name: "rtl",
  optional: false,
  tsDoc: ``,
  doc: { en: `` },
  value: "GridAtom<boolean>",
};

const FilterModel: PropertyType = {
  kind: "property",
  name: "filterModel",
  optional: false,
  tsDoc: ``,
  doc: { en: `` },
  value: "GridAtom<FilterModelItem<T>[]>",
};

const RowGroupModel: PropertyType = {
  kind: "property",
  name: "rowGroupModel",
  optional: false,
  tsDoc: ``,
  doc: { en: `` },
  value: "GridAtom<RowGroupModelItem<T>[]>",
};

const RowGroupDisplayMode: PropertyType = {
  kind: "property",
  name: "rowGroupDisplayMode",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<RowGroupDisplayMode>",
};

const RowGroupDefaultExpansion: PropertyType = {
  kind: "property",
  name: "rowGroupDefaultExpansion",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<boolean | number>",
};

const RowGroupExpansions: PropertyType = {
  kind: "property",
  name: "rowGroupExpansions",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<{ [rowId: string]: boolean | undefined }>",
};

const RowGroupColumn: PropertyType = {
  kind: "property",
  name: "rowGroupColumn",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<RowGroupColumn<T>>",
};

const AggModel: PropertyType = {
  kind: "property",
  name: "aggModel",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<{ [columnId: string]: { fn: AggModelFn<T> } }>",
};

const FloatingRowEnabled: PropertyType = {
  kind: "property",
  name: "floatingRowEnabled",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<boolean>",
};
const FloatingRowHeight: PropertyType = {
  kind: "property",
  name: "floatingRowHeight",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<number>",
};
const FloatingCellRenderers: PropertyType = {
  kind: "property",
  name: "floatingCellRenderers",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Record<string, HeaderFloatingCellRendererFn<T>>>",
};
const HeaderCellRenderers: PropertyType = {
  kind: "property",
  name: "headerCellRenderers",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Record<string, HeaderCellRendererFn<T>>>",
};

const EditRenderers: PropertyType = {
  kind: "property",
  name: "editRenderers",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Record<string, EditRendererFn<T>>>",
};

const EditRowValidatorFn: PropertyType = {
  kind: "property",
  name: "editRowValidatorFn",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<{ fn: EditRowValidatorFn<T> }>",
};

const EditClickActivator: PropertyType = {
  kind: "property",
  name: "editClickActivator",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<EditClickActivator>",
};

const EditCellMode: PropertyType = {
  kind: "property",
  name: "editCellMode",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<EditCellMode>",
};

const EditActivePosition: PropertyType = {
  kind: "property",
  name: "editActivePosition",
  value: "GridAtomReadonly<EditActivePosition<T> | null>",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
};

const ColumnMarker: PropertyType = {
  kind: "property",
  name: "columnMarker",
  value: "GridAtom<ColumnMarker<T>>",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
};

const ColumnMarkerEnabled: PropertyType = {
  kind: "property",
  name: "columnMarkerEnabled",
  value: "GridAtom<boolean>",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
};

const RowDetailRenderer: PropertyType = {
  kind: "property",
  name: "rowDetailRenderer",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<{ fn: RowDetailRendererFn<T> }>",
};
const RowDetailHeight: PropertyType = {
  kind: "property",
  name: "rowDetailHeight",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<RowDetailHeight>",
};
const RowDetailAutoHeightGuess: PropertyType = {
  kind: "property",
  name: "rowDetailAutoHeightGuess",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<number>",
};
const RowDetailExpansions: PropertyType = {
  kind: "property",
  name: "rowDetailExpansions",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Set<string>>",
};

const RowSelectedIds: PropertyType = {
  kind: "property",
  name: "rowSelectedIds",
  tsDoc: ``,
  doc: { en: `` },
  optional: false,
  value: "GridAtom<Set<string>>",
};

const RowSelectionMode: PropertyType = {
  kind: "property",
  name: "rowSelectionMode",
  doc: { en: `` },
  optional: false,
  tsDoc: ``,
  value: "GridAtom<RowSelectionMode>",
};
const RowSelectionPivot: PropertyType = {
  kind: "property",
  name: "rowSelectionPivot",
  doc: { en: `` },
  optional: false,
  tsDoc: ``,
  value: "GridAtom<string | null>",
};

const RowSelectionActivator: PropertyType = {
  kind: "property",
  name: "rowSelectionActivator",
  doc: { en: `` },
  optional: false,
  tsDoc: ``,
  value: "GridAtom<RowSelectionActivator>",
};

export const GridStateCore: InterfaceType = {
  kind: "interface",
  export: true,
  name: "GridState<T>",
  tag: "core",
  tsDoc: ``,
  doc: { en: `` },
  properties: [
    Columns,
    ColumnMeta,
    ColumnBase,
    ColumnGroupDefaultExpansion,
    ColumnGroupExpansions,
    ColumnGroupJoinDelimiter,
    ColumnGroupMeta,
    ColumnSizeToFit,
    GridId,
    XPositions,
    YPositions,
    WidthTotal,
    HeightTotal,
    Viewport,
    ViewportWidthInner,
    ViewportWidthOuter,
    ViewportHeightInner,
    ViewportHeightOuter,
    HeaderHeight,
    HeaderGroupHeight,
    RowDataStore,
    RowDataSource,
    RowAutoHeightGuess,
    RowHeight,
    RowScanDistance,
    ColScanDistance,

    RowOverscanTop,
    RowOverscanBottom,
    ColOverscanStart,
    ColOverscanEnd,

    RowFullWidthPredicate,
    RowFullWidthRenderer,
    CellRenderers,

    Rtl,

    SortModel,
    FilterModel,

    AggModel,
    RowGroupModel,
    RowGroupColumn,
    RowGroupDisplayMode,
    RowGroupDefaultExpansion,
    RowGroupExpansions,

    FloatingRowEnabled,
    FloatingRowHeight,
    FloatingCellRenderers,
    HeaderCellRenderers,

    EditRenderers,
    EditRowValidatorFn,
    EditClickActivator,
    EditCellMode,
    EditActivePosition,

    ColumnMarker,
    ColumnMarkerEnabled,

    RowDetailRenderer,
    RowDetailHeight,
    RowDetailAutoHeightGuess,
    RowDetailExpansions,

    RowSelectedIds,
    RowSelectionMode,
    RowSelectionPivot,
    RowSelectionActivator,
  ],
};
