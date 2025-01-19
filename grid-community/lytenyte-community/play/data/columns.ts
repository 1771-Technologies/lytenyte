import type { ColumnCommunityReact } from "@1771technologies/grid-types";

export const columns: ColumnCommunityReact<any>[] = [
  { id: "age", type: "number", pin: "start" },
  { id: "job" },
  { id: "balance", type: "number", pin: "start" },
  { id: "education", pin: "end" },
  { id: "marital" },
  { id: "default", pin: "end" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];
