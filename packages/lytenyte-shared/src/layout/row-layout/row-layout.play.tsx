import { useEffect, useState } from "react";
import { makeLayoutState } from "../make-layout-state";
import { updateLayout } from "../update-layout";
import { makeRowLayout } from "./row-layout";

export default function RowLayoutPlay() {
  const [currentTs, setCurrentTs] = useState(0);
  const [re, setRe] = useState(0);
  useEffect(() => {
    const state = makeLayoutState(100, 100_000);

    updateLayout({
      base: state.base,
      computed: state.computed,
      lookup: state.lookup,
      special: state.special,

      botCount: 3,
      topCount: 3,

      startCount: 2,
      centerCount: 96,
      endCount: 2,
      computeColSpan: (r, c) => ((r + c) % 3 == 1 ? 2 : 1),
      computeRowSpan: (r, c) => ((r + c) % 10 === 3 ? 3 : 1),
      isFullWidth: (r) => r % 10 === 2,
      isRowCutoff: () => false,

      rowStart: 3,
      rowEnd: 99_997,
      rowMax: 99_997,
      rowScanDistance: 200,
    });

    const columns = Array.from({ length: 100 }, (_, i) => ({ id: `${i}` }));

    const views = [];

    const start = performance.now();
    for (let i = 0; i < 999; i++) {
      const view = makeRowLayout({
        layout: state,
        columns,
        focus: null,
        rowForIndex: () => ({ get: () => ({ id: "x" }) }) as any,
        view: {
          colStartStart: 0,
          colStartEnd: 2,
          colCenterStart: 8,
          colCenterEnd: 50,
          colCenterLast: 98,
          colEndStart: 98,
          colEndEnd: 100,
          rowTopStart: 0,
          rowTopEnd: 3,
          rowCenterStart: i * 100 + 3,
          rowCenterEnd: i * 100 + 153,
          rowCenterLast: 99997,
          rowBotStart: 99_997,
          rowBotEnd: 100_000,
        },
      });
      views.push(view);
    }
    const end = performance.now();

    console.log(views);

    setCurrentTs(end - start);
  }, [re]);

  return (
    <div>
      <button
        onClick={() => {
          setRe((prev) => prev + 1);
        }}
      >
        Rerun
      </button>
      <div>Time: {currentTs}</div>
    </div>
  );
}
