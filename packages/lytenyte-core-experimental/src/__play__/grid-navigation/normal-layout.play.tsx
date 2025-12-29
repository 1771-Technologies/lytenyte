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
export default function BasicRendering({
  rtl,
  columns,
  pinTop,
  center,
  pinBot,
  floatingRow,
}: {
  rtl?: boolean;
  columns?: Grid.Column[];
  center?: number;
  pinTop?: number;
  pinBot?: number;
  floatingRow?: boolean;
}) {
  const ds = useClientDataSource({
    data: center ? bankDataSmall.slice(0, center) : bankDataSmall,
    topData: pinTop ? bankDataSmall.slice(0, pinTop) : [],
    bottomData: pinBot ? bankDataSmall.slice(0, pinBot) : [],
  });

  return (
    <div className="with-border-cells">
      <button tabIndex={0} onClick={() => {}}>
        Top Capture
      </button>
      <div style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
        <Grid columns={columns ?? baseColumns} rowSource={ds} rtl={rtl} floatingRowEnabled={floatingRow} />
      </div>
      <button tabIndex={0} onClick={() => {}}>
        Bottom Capture
      </button>
    </div>
  );
}
