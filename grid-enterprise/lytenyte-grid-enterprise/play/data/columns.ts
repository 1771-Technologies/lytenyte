import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";

export const columns: ColumnEnterpriseReact<any>[] = [
  {
    id: "age",
    groupPath: ["Information"],
    type: "number",
    pin: "start",
    rowGroupable: true,
    cellEditPredicate: true,
  },
  { id: "job", rowGroupable: true, cellEditPredicate: true },
  {
    id: "balance",
    type: "number",
    pin: "start",
    rowGroupable: true,
    aggFunc: "sum",
  },
  {
    id: "education",
    rowGroupable: true,
    cellEditPredicate: true,
    rowSpan: (a) => (a.row.rowIndex === 4 ? 3 : 1),
    columnSpan: (a) => (a.row.rowIndex === 4 ? 3 : 1),
  },
  {
    id: "marital",
    aggFunc: "first",
    pin: "end",
  },
  { id: "default", groupPath: ["Alpha"] },
  { id: "housing" },
  { id: "loan", groupPath: ["Xeno", "Sigma"] },
  { id: "contact", groupPath: ["Xeno", "Sigma"] },
  { id: "day", groupPath: ["Xeno"] },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", columnSpan: 2 },
  { id: "y" },
];
