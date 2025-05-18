"use client";

import { useEffect, useState } from "react";

import { GridContainer } from "@1771technologies/lytenyte-pro/grid-container";
import { useClientDataSource, useLyteNytePro, LyteNyteGrid } from "@1771technologies/lytenyte-pro";
import { data, nextData } from "./high-frequency/high-frequency-data";
import { hfColumns } from "./high-frequency/high-frequency-columns";

export default function HighFrequencyDemo() {
  return <HighFrequencyDemoImpl />;
}

function HighFrequencyDemoImpl() {
  const ds = useClientDataSource<any>({
    data: data,
  });

  const grid = useLyteNytePro({
    gridId: "hf-demo",
    columnHeaderHeight: 28,
    rowDataSource: ds,
    rowHeight: 40,
    rowGroupModel: ["symbol"],
    sortModel: [{ columnId: "lastUpdate", isDescending: true }],

    aggModel: {
      time: { fn: "first" },
      volume: { fn: "group" },
      bid: { fn: "avg" },
      ask: { fn: "avg" },
      spread: { fn: "avg" },
      volatility: { fn: "first" },
      latency: { fn: "first" },
      pnl: { fn: "first" },
      symbol: { fn: "first" },
    },

    columns: hfColumns,
  });

  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    if (speed === 0) return;

    const x = setInterval(() => {
      nextData();
      const next = data;

      grid.api.rowReplaceData(next);
    }, speed);

    return () => clearInterval(x);
  }, [grid.api, speed]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GridContainer
        top={
          <div>
            <button onClick={() => setSpeed(0)}>Pause</button>
            <button onClick={() => setSpeed(1000)}>100</button>
            <button onClick={() => setSpeed(600)}>500</button>
            <button onClick={() => setSpeed(300)}>1000</button>
            <button onClick={() => setSpeed(100)}>5000</button>
            <button onClick={() => setSpeed(20)}>10000</button>
          </div>
        }
      >
        <div
          className={css`
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
          `}
        >
          <div
            className={css`
              flex: 1;
            `}
          >
            <LyteNyteGrid grid={grid} />
          </div>
        </div>
      </GridContainer>
    </div>
  );
}
