import { useEffect, useState } from "react";
import { applyLayoutUpdate } from "./apply-layout-update";
import type { LayoutMap } from "../+types.non-gen";
import { DEFAULT_PREVIOUS_LAYOUT } from "../+constants";
import { updateLayout } from "../layout-2/update-layout";
import { makeLayoutState } from "../layout-2/make-layout-state";

export default function LayoutBenchmarker() {
  const [timeTaken, setTimeTaken] = useState(0);
  const [re, setRe] = useState(0);
  const [altTime, setAltTime] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const layoutMap: LayoutMap = new Map();
    for (let i = 0; i < 1000; i++) {
      applyLayoutUpdate({
        computeColSpan: (r, c) => ((r + c) % 3 === 1 ? 2 : 1),
        computeRowSpan: (r, c) => ((r + c) % 10 === 1 ? 3 : 1),
        isFullWidth: (r) => r + 1111 === 1234,
        isRowCutoff: () => false,
        colScanDistance: 100,
        rowScanDistance: 100,
        invalidated: false,
        layoutMap,
        nextLayout: {
          rowTopStart: 0,
          rowTopEnd: 3,
          rowCenterStart: i * 10,
          rowCenterEnd: i * 10 + 100,
          rowCenterLast: 12000,
          rowBotStart: 12000,
          rowBotEnd: 12003,
          colStartStart: 0,
          colStartEnd: 2,
          colCenterStart: 10,
          colCenterEnd: 22,
          colCenterLast: 80,
          colEndStart: 80,
          colEndEnd: 82,
        },
        prevLayout: DEFAULT_PREVIOUS_LAYOUT,
      });
    }
    const end = performance.now();

    const ls = makeLayoutState(82, 100_000);

    // updateFull({
    //   computed,
    //   special,
    //   deadCells,
    //   spanLookup,

    //   startCount: 2,
    //   centerCount: 78,
    //   endCount: 2,
    //   botCount: 3,
    //   topCount: 3,

    //   rowStart: 3,
    //   rowEnd: 12000,
    //   rowMax: 12000,
    //   rowScanDistance: 100,

    //   computeColSpan: (r, c) => ((r + c) % 3 === 1 ? 2 : 1),
    //   computeRowSpan: (r, c) => ((r + c) % 10 === 1 ? 3 : 1),
    //   isFullWidth: (r) => r + 1111 === 1234,
    //   isRowCutoff: () => false,
    // });

    const altStart = performance.now();
    for (let i = 0; i < 1000; i++) {
      updateLayout({
        ...ls,
        startCount: 2,
        centerCount: 78,
        endCount: 2,
        botCount: 3,
        topCount: 3,

        rowStart: 3,
        rowEnd: 12000,
        rowMax: 12000,
        rowScanDistance: 100,

        computeColSpan: (r, c) => ((r + c) % 3 === 1 ? 2 : 1),
        computeRowSpan: (r, c) => ((r + c) % 10 === 1 ? 3 : 1),
        isFullWidth: (r) => r + 1111 === 1234,
        isRowCutoff: () => false,
      });
    }
    const altEnd = performance.now();

    setTimeTaken(end - start);
    setAltTime(altEnd - altStart);
  }, [re]);

  return (
    <div>
      <div>Time: {timeTaken}</div>
      <div>Alt Time: {altTime}</div>
      <button onClick={() => setRe((prev) => prev + 1)}>Rerun</button>
    </div>
  );
}
