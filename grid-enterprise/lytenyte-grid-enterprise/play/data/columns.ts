import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";

export const columns: ColumnEnterpriseReact<any>[] = [
  { id: "age", groupPath: ["Information"], type: "number", pin: "start", rowGroupable: true },
  { id: "job", rowGroupable: true },
  {
    id: "balance",
    type: "number",
    pin: "start",
    rowGroupable: true,
    aggFunc: "sum",
    headerSecondaryLabel: "ex",
  },
  { id: "education", rowGroupable: true },
  {
    id: "marital",
    aggFunc: "first",
    headerSecondaryLabel: "something",
    headerAggFuncDisplayMode: "secondary",
  },
  { id: "default", groupPath: ["Alpha"], headerSecondaryLabel: "extra" },
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
