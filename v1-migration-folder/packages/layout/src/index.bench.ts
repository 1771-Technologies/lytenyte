import { Bench, hrtimeNow } from "tinybench";
import { applyLayoutUpdate } from "./layout/apply-layout-update.js";
import { DEFAULT_PREVIOUS_LAYOUT } from "./+constants.layout.js";

const bench = new Bench({
  name: "Layout",
  time: 1_000,
  now: hrtimeNow,
  warmup: true,
});

bench.add("applyLayoutUpdate: small", () => {
  const map = new Map();

  applyLayoutUpdate({
    colScanDistance: 200,
    rowScanDistance: 200,
    computeColSpan: (r, c) => (r % 2 ? 2 : c % 3 ? 3 : 2),
    computeRowSpan: (r, c) => (r % 2 ? 2 : c % 3 ? 3 : 2),
    invalidated: false,
    isFullWidth: (r) => r % 7 === 0,
    isRowCutoff: (r) => r % 33 === 0,
    layoutMap: map,
    nextLayout: {
      colStartStart: 0,
      colStartEnd: 3,
      colCenterStart: 3,
      colCenterEnd: 10,
      colCenterLast: 200,
      colEndStart: 200,
      colEndEnd: 203,

      rowTopStart: 0,
      rowTopEnd: 3,
      rowCenterStart: 3,
      rowCenterEnd: 10,
      rowCenterLast: 200,
      rowBotStart: 200,
      rowBotEnd: 205,
    },
    prevLayout: DEFAULT_PREVIOUS_LAYOUT,
  });
});

bench.add("applyLayoutUpdate: medium", () => {
  const map = new Map();

  applyLayoutUpdate({
    colScanDistance: 200,
    rowScanDistance: 200,
    computeColSpan: (r, c) => (r % 2 ? 2 : c % 3 ? 3 : 2),
    computeRowSpan: (r, c) => (r % 2 ? 2 : c % 3 ? 3 : 2),
    invalidated: false,
    isFullWidth: (r) => r % 7 === 0,
    isRowCutoff: (r) => r % 33 === 0,
    layoutMap: map,
    nextLayout: {
      colStartStart: 0,
      colStartEnd: 3,
      colCenterStart: 10,
      colCenterEnd: 50,
      colCenterLast: 200,
      colEndStart: 200,
      colEndEnd: 203,

      rowTopStart: 0,
      rowTopEnd: 3,
      rowCenterStart: 20,
      rowCenterEnd: 50,
      rowCenterLast: 200,
      rowBotStart: 200,
      rowBotEnd: 205,
    },
    prevLayout: DEFAULT_PREVIOUS_LAYOUT,
  });
});

bench.add("applyLayoutUpdate: large", () => {
  const map = new Map();

  applyLayoutUpdate({
    colScanDistance: 200,
    rowScanDistance: 200,
    computeColSpan: (r, c) => (r % 2 ? 2 : c % 3 ? 3 : 2),
    computeRowSpan: (r, c) => (r % 2 ? 2 : c % 3 ? 3 : 2),
    invalidated: false,
    isFullWidth: (r) => r % 7 === 0,
    isRowCutoff: (r) => r % 33 === 0,
    layoutMap: map,
    nextLayout: {
      colStartStart: 0,
      colStartEnd: 3,
      colCenterStart: 50,
      colCenterEnd: 200,
      colCenterLast: 500,
      colEndStart: 500,
      colEndEnd: 503,

      rowTopStart: 0,
      rowTopEnd: 3,
      rowCenterStart: 100,
      rowCenterEnd: 300,
      rowCenterLast: 500,
      rowBotStart: 500,
      rowBotEnd: 505,
    },
    prevLayout: DEFAULT_PREVIOUS_LAYOUT,
  });
});

bench.add("applyLayoutUpdate: insane", () => {
  const map = new Map();

  applyLayoutUpdate({
    colScanDistance: 200,
    rowScanDistance: 200,
    computeColSpan: (r, c) => (r % 2 ? 2 : c % 3 ? 3 : 2),
    computeRowSpan: (r, c) => (r % 2 ? 2 : c % 3 ? 3 : 2),
    invalidated: false,
    isFullWidth: (r) => r % 7 === 0,
    isRowCutoff: (r) => r % 33 === 0,
    layoutMap: map,
    nextLayout: {
      colStartStart: 0,
      colStartEnd: 3,
      colCenterStart: 200,
      colCenterEnd: 1000,
      colCenterLast: 2000,
      colEndStart: 2000,
      colEndEnd: 2003,

      rowTopStart: 0,
      rowTopEnd: 3,
      rowCenterStart: 200,
      rowCenterEnd: 1000,
      rowCenterLast: 2000,
      rowBotStart: 2000,
      rowBotEnd: 2005,
    },
    prevLayout: DEFAULT_PREVIOUS_LAYOUT,
  });
});

await bench.run();

console.log(bench.name);
console.table(bench.table());
