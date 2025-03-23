import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";

export const columns: ColumnEnterpriseReact<any>[] = [
  {
    id: "age",
    groupPath: ["Information"],
    type: "number",
    pin: "start",
    rowGroupable: true,
    columnPivotable: true,
  },
  { id: "job", rowGroupable: true, widthFlex: 1 },
  {
    id: "balance",
    type: "number",
    pin: "start",
    rowGroupable: true,
    aggFn: "sum",
    measureFn: "sum",
  },
  {
    id: "education",
    rowGroupable: true,
    columnPivotable: true,
  },
  {
    id: "marital",
    aggFn: "first",
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
