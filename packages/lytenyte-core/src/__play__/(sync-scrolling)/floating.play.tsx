import { useState } from "react";
import { useClientDataSource, Grid } from "../../index.js";
import { bankData } from "@1771technologies/grid-sample-data/bank-data";

interface Spec {
  readonly data: (typeof bankData)[number];
}

const columns: Grid.Column<Spec>[] = [
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

  { id: "1loan" },
  { id: "1contact" },
  { id: "1day" },
  { id: "1month" },
  { id: "1duration" },
  { id: "1campaign" },
  { id: "1pdays" },
  { id: "1previous" },
  { id: "1poutcome", name: "P Outcome" },
  { id: "1y" },

  { id: "2loan" },
  { id: "2contact" },
  { id: "2day" },
  { id: "2month" },
  { id: "2duration" },
  { id: "2campaign" },
  { id: "2pdays" },
  { id: "2previous" },
  { id: "2poutcome", name: "P Outcome" },
  { id: "2y" },
];
export default function BasicRendering() {
  const ds = useClientDataSource({
    data: bankData,
    sort: [{ dim: { id: "education" } }],
  });
  const [sync, setSync] = useState(true);
  const [rtl, setRtl] = useState(false);

  return (
    <>
      <button onClick={() => setSync((prev) => !prev)}>
        {sync ? "Scrolling In Sync" : "Multi Threaded Scrolling"}
      </button>
      <button onClick={() => setRtl((prev) => !prev)}>{rtl ? "Rtl On" : "Rtl Off"}</button>
      <div style={{ width: "100%", height: "95vh", border: "1px solid black" }}>
        <Grid
          columns={columns}
          rowSource={ds}
          rtl={rtl}
          viewportInitialHeight={500}
          viewportInitialWidth={500}
          suppressScrollFlash={sync}
          floatingRowEnabled
        />
      </div>
    </>
  );
}

if (import.meta.vitest) {
  const { test } = import.meta.vitest;
  // const { userEvent } = await import("vitest/browser");
  // const { wait, getCellQuery } = await import("../utils.js");
  // const { render } = await import("vitest-browser-react");

  test("Should be able to switch between sync and multi-threaded scrolling", async () => {});
  test("Should be able to scroll to the bottom on the grid", async () => {});
  test("Should be able to scroll midway on the grid", async () => {});
}
