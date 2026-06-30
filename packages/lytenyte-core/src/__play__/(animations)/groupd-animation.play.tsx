import "../test.css";
import { useClientDataSource, Grid } from "../../index.js";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useRef } from "react";

// bankDataSmall rows have no natural unique key, so by default the grid assigns leaf ids based on
// array index - meaning an insertion would shift every later row's id and make them all look like
// delete+add instead of move. __id gives each row a stable identity independent of position.
type Row = (typeof bankDataSmall)[number] & { __id: number };

interface Spec {
  readonly data: Row;
}

const columns: Grid.Column<Spec>[] = [
  { id: "age", groupPath: ["Personal"] },
  { id: "job", groupPath: ["Personal"] },
  { id: "balance", groupPath: ["Personal"] },
  { id: "education", groupPath: ["Status"] },
  { id: "marital", groupPath: ["Status"] },
  { id: "default", groupPath: ["Status"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];
const initialData: Row[] = bankDataSmall.map((r, i) => ({ ...r, __id: i }));

const RowGroupCell = ({ api, row }: Grid.T.CellParams<Spec>) => {
  if (!api.rowIsGroup(row)) return;

  const label = row.key;

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%", gap: 8 }}>
      <button onClick={() => api.rowGroupToggle(row)}>{row.expanded ? "-" : "+"}</button>
      <span>{label}</span>
    </div>
  );
};

const groupDef: Grid.RowGroupColumn<Spec> = {
  cellRenderer: RowGroupCell,
};

export default function BasicRendering() {
  const apiRef = useRef<Grid.API<Spec>>(null);

  const ds = useClientDataSource({
    data: initialData,
    group: [{ id: "age" }, { id: "education" }],
  });

  return (
    <>
      <div style={{ width: "80%", height: "95vh", border: "1px solid black" }}>
        <Grid
          ref={apiRef}
          columns={columns}
          suppressScrollFlash
          rowSource={ds}
          viewportInitialHeight={500}
          viewportInitialWidth={500}
          rowAlternateAttr="root"
          rowOverscanTop={0}
          rowOverscanBottom={0}
          rowHeight={50}
          rowAnimate={true}
          columnAnimate={true}
          rowGroupColumn={groupDef}
        />
      </div>
    </>
  );
}
