import type { ColumnCommunityReact } from "@1771technologies/grid-types";

export const columns: ColumnCommunityReact<any>[] = [
  { id: "age", groupPath: ["Information"], type: "number", pin: "start", rowGroupable: true },
  { id: "job", rowGroupable: true },
  { id: "balance", type: "number", pin: "start", rowGroupable: true },
  { id: "education", rowGroupable: true },
  { id: "marital" },
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
