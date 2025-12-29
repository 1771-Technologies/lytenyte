import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import "./navigation.css";

const baseColumns: Grid.Column[] = [
  { id: "age" },
  { id: "job" },
  { id: "balance" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
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

const rowFullWidthPredicate: Grid.Props["rowFullWidthPredicate"] = (r) => r.rowIndex === 2 || r.rowIndex == 4;
const rowFullWidthRenderer: Grid.Props["rowFullWidthRenderer"] = (r) => {
  if (r.rowIndex === 2) return <div>Nothing</div>;

  return (
    <div>
      <button tabIndex={0}>A</button>
      <button tabIndex={0}>B</button>
      <button tabIndex={0}>C</button>
    </div>
  );
};

export default function FullWidthRows({ rtl, columns }: { rtl?: boolean; columns?: Grid.Column[] }) {
  const ds = useClientDataSource({
    data: bankDataSmall,
  });

  return (
    <div>
      <button tabIndex={0} onClick={() => {}}>
        Top Capture
      </button>
      <div style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
        <Grid
          columns={columns ?? baseColumns}
          rowSource={ds}
          rtl={rtl}
          rowFullWidthPredicate={rowFullWidthPredicate}
          rowFullWidthRenderer={rowFullWidthRenderer}
        />
      </div>
      <button tabIndex={0} onClick={() => {}}>
        Bottom Capture
      </button>
    </div>
  );
}
