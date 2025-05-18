import type { ColumnProReact } from "@1771technologies/grid-types/pro-react";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const stockColumns: ColumnProReact<(string | number | null)[]>[] = [
  {
    id: "symbol",
    headerName: "Symbol",
    field: 0,
    rowGroupField: 0,
    width: 280,
    aggFnDefault: "count",
    groupPath: ["A"],
    groupVisibility: "always-visible",
    filterSupportsQuickSearch: true,
    aggFnsAllowed: ["first", "last", "count"],
    quickSearchField: (d) => `${d[0]} ${d[1]}`,

    cellAutosizeFn: ({ api, row, column }) => {
      if (api.rowIsGroup(row)) {
        const data = row.data[column.id];
        const text = `${data as string} Symbols`;

        const metric = api.autosizeMeasure(text);
        if (!metric) return 8;

        return metric.width + 8;
      }
      if (!api.rowIsLeaf(row)) return 0;

      const symbol = (row.data[0] as string) ?? "";
      const desc = row.data[1];

      const text = api.autosizeMeasure(`${symbol} ${desc}`);

      if (!text) return 8;

      return text.width + 16 + 60;
    },
  },
  {
    id: "exchange",
    headerName: "Exchange",
    field: 15,
    rowGroupField: 15,
    width: 150,
    groupPath: ["A"],
    rowGroupable: true,
    columnPivotable: true,
    aggFnDefault: "count",
    aggFnsAllowed: ["first", "last", "count"],

    filterSupportsQuickSearch: true,
    cellAutosizeFn: ({ api, row, column }) => {
      const field = api.columnField(row, column);

      if (api.rowIsGroup(row)) {
        return 0;
      }
      const text = api.autosizeMeasure(String(field) as string);
      if (!text) return 0;

      return text.width + 16 + 36;
    },
  },
  {
    id: "price",
    headerName: "Price",
    groupPath: ["A"],
    field: 3,
    width: 110,
    type: "number",
    aggFnDefault: "avg",
    aggFnsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],

    inFilterLabelFormatter: (v) => (typeof v === "number" ? `$${formatter.format(v)}` : "-"),
    cellAutosizeFn: ({ api, row, column }) => {
      const field = api.columnField(row, column);

      const label = typeof field === "number" ? formatter.format(field) : "-";
      const current = "USD";

      const text = api.autosizeMeasure(`${label} ${label === "-" ? "" : current}`);

      return (text?.width ?? 0) + 8;
    },
  },
  {
    id: "price-change",
    headerName: "Change %",
    field: 5,
    width: 130,
    type: "number",
    aggFnDefault: "avg",
    aggFnsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],

    inFilterLabelFormatter: (v) => (typeof v === "number" ? `${formatter.format(v)}%` : "-"),
    cellAutosizeFn: ({ api, row, column }) => {
      const field = api.columnField(row, column) as number;

      const label = typeof field === "number" ? formatter.format(field) + "%" : "-";

      const text = api.autosizeMeasure(label);

      return (text?.width ?? 0) + 16;
    },
  },

  {
    id: "analyst rating",
    headerName: "Analyst Rating",
    rowGroupField: 2,
    field: 2,
    aggFnsAllowed: ["count", "first", "last"],

    filterSupportsQuickSearch: true,

    inFilterLabelFormatter: (v) => (v as string) || "-",
    cellAutosizeFn: ({ api, row, column }) => {
      const field = api.columnField(row, column) as string;

      const text = api.autosizeMeasure(field);

      return (text?.width ?? 0) + 16 + 62;
    },
  },
  {
    id: "eps-diluted",
    headerName: "EPS dil",
    field: 11,
    type: "number",
    aggFnDefault: "avg",

    aggFnsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],
    uiHints: {
      subTitle: "TTM",
      stacked: true,
      columnMenu: true,
      sortButton: true,
      showAggName: true,
    },
    inFilterLabelFormatter: (v) => (typeof v === "number" ? `$${formatter.format(v)}` : "-"),

    cellAutosizeFn: ({ api, row, column }) => {
      const field = api.columnField(row, column);

      const label = typeof field === "number" ? formatter.format(field) : "-";
      const current = "USD";

      const text = api.autosizeMeasure(`${label} ${label === "-" ? "" : current}`);

      return (text?.width ?? 0) + 8;
    },
  },
  {
    id: "volume",
    headerName: "Volume",
    field: 6,
    type: "number",
    aggFnDefault: "sum",

    aggFnsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],

    inFilterLabelFormatter: (v) => (typeof v === "number" ? `${formatter.format(v)}` : "-"),
  },
  {
    id: "market-capitalization",
    headerName: "Market Cap",
    field: 8,
    type: "number",
    aggFnDefault: "avg",

    aggFnsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],

    inFilterLabelFormatter: (v) => (typeof v === "number" ? `${formatter.format(v)}` : "-"),
  },
  {
    id: "price-earning",
    headerName: "P/E",
    field: 10,
    width: 80,
    type: "number",
    aggFnDefault: "avg",
    aggFnsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],

    inFilterLabelFormatter: (v) => (typeof v === "number" ? `${formatter.format(v)}` : "-"),

    cellAutosizeFn: ({ api, row, column }) => {
      const field = api.columnField(row, column) as number;

      const label = typeof field === "number" ? formatter.format(field) : "";

      const text = api.autosizeMeasure(label);

      return (text?.width ?? 0) + 16;
    },
  },
  {
    id: "eps-diluted-growth",
    headerName: "EPS dil growth",
    field: 13,
    type: "number",
    aggFnDefault: "avg",
    aggFnsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],

    uiHints: {
      columnMenu: true,
      showAggName: true,
      sortButton: true,
      stacked: true,
      subTitle: "TTM YoY",
    },
    inFilterLabelFormatter: (v) => (typeof v === "number" ? `${formatter.format(v)}%` : "-"),

    cellAutosizeFn: ({ api, row, column }) => {
      const field = api.columnField(row, column) as number;

      const label = typeof field === "number" ? formatter.format(field) + "%" : "-";

      const text = api.autosizeMeasure(label);

      return (text?.width ?? 0) + 16;
    },
  },
  {
    id: "dividend yield",
    headerName: "Div yield %",
    field: 14,
    type: "number",
    aggFnDefault: "avg",
    aggFnsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],

    uiHints: {
      columnMenu: true,
      showAggName: true,
      sortButton: true,
      stacked: true,
      subTitle: "TTM",
    },
    inFilterLabelFormatter: (v) => (typeof v === "number" ? `${formatter.format(v)}%` : "-"),

    cellAutosizeFn: ({ api, row, column }) => {
      const field = api.columnField(row, column) as number;

      const label = typeof field === "number" ? formatter.format(field) + "%" : "-";

      const text = api.autosizeMeasure(label);

      return (text?.width ?? 0) + 16;
    },
  },

  {
    id: "rel-volume",
    headerName: "Rel Volume",
    field: 7,
    width: 130,
    type: "number",
    aggFnDefault: "avg",
    aggFnsAllowed: ["first", "last", "count", "min", "max", "avg", "sum"],

    inFilterLabelFormatter: (v) => (typeof v === "number" ? `${formatter.format(v)}` : "-"),

    cellAutosizeFn: ({ api, row, column }) => {
      const field = api.columnField(row, column) as number;

      const label = typeof field === "number" ? formatter.format(field) : "";

      const text = api.autosizeMeasure(label);

      return (text?.width ?? 0) + 16;
    },
  },
  {
    id: "industry",
    headerName: "Industry",
    field: 17,
    rowGroupField: 17,
    width: 250,
    rowGroupable: true,
    columnPivotable: true,

    aggFnDefault: "count",
    aggFnsAllowed: ["first", "last", "count"],
    filterSupportsQuickSearch: true,
  },
  {
    id: "sector",
    headerName: "Sector",
    field: 16,
    rowGroupField: 16,
    width: 180,
    rowGroupable: true,
    columnPivotable: true,
    aggFnDefault: "count",

    aggFnsAllowed: ["first", "last", "count"],
    filterSupportsQuickSearch: true,
  },
];
