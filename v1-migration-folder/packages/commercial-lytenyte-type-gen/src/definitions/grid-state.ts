import type { InterfaceType, PropertyType } from "../+types.js";

/**
 * Grid State
 */
const Columns: PropertyType = {
  kind: "property",
  name: "columns",
  optional: false,
  value: "GridAtom<Column[]>",
  tsDoc: ``,
  doc: { en: `` },
};

const ColumnBase: PropertyType = {
  kind: "property",
  name: "columnBase",
  optional: false,
  value: "GridAtom<ColumnBase>",
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
  value: "GridAtomReadonly<ColumnMeta>",
  tsDoc: ``,
  doc: { en: `` },
};

const RowDataStore: PropertyType = {
  kind: "property",
  name: "rowDataStore",
  optional: false,
  value: "RowDataStore",
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
const RowAutoHeightCache: PropertyType = {
  kind: "property",
  name: "rowAutoHeightCache",
  optional: false,
  value: "GridAtom<Record<number, number>>",
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
    RowAutoHeightCache,
    RowAutoHeightGuess,
    RowHeight,
    RowScanDistance,
    ColScanDistance,

    RowOverscanTop,
    RowOverscanBottom,
    ColOverscanStart,
    ColOverscanEnd,

    RowFullWidthPredicate,
  ],
};
