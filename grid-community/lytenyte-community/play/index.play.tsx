import { makeStore } from "@1771technologies/grid-store-community";
import { LyteNyteCommunity } from "../src/lytenyte-community";
import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";
import { useState } from "react";

export default function Play() {
  const x = useState(() =>
    makeStore({
      gridId: "x",
      columns: columns,
      rowDataSource: {
        kind: "client",
        data: bankDataSmall,
        topData: bankDataSmall.slice(0, 2),
        bottomData: bankDataSmall.slice(2, 4),
      },
    }),
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LyteNyteCommunity grid={x[0]} />
    </div>
  );
}
