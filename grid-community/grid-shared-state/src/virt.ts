import { computed } from "@1771technologies/react-cascada";
import { END_ENCODING, FULL_ENCODING } from "@1771technologies/grid-constants";
import { computeBounds } from "@1771technologies/grid-core";
import type { ApiCommunity, ApiEnterprise, StoreEnterprise } from "@1771technologies/grid-types";

export const virt = <D, E>(api: ApiCommunity<D, E> | ApiEnterprise<D, E>) => {
  return {
    virtBounds: computed(() => {
      const s = api.getState();
      const sx = api.getState().internal;
      const viewportWidth = sx.viewportInnerWidth.get();
      const viewportHeight = sx.viewportInnerHeight.get();
      const yPositions = sx.rowPositions.get();
      const xPositions = sx.columnPositions.get();

      const topCount = sx.rowTopCount.get();
      const bottomCount = sx.rowBottomCount.get();
      const startCount = s.columnVisibleStartCount.get();
      const endCount = s.columnVisibleEndCount.get();

      const scrollX = sx.viewportXScroll.get();
      const scrollY = sx.viewportYScroll.get();

      const b = computeBounds({
        viewportWidth,
        viewportHeight,

        bottomCount,
        topCount,
        startCount,
        endCount,

        scrollLeft: scrollX,
        scrollTop: scrollY,

        xPositions,
        yPositions,
      });

      return b;
    }),
    virtLayout: computed(() => {
      const s = api.getState();

      const topCount = s.internal.rowTopCount.get();
      const rowCount = s.internal.rowCount.get();
      const bottomCount = s.internal.rowBottomCount.get();
      const startCount = s.columnVisibleStartCount.get();
      const centerCount = s.columnVisibleCenterCount.get();
      const endCount = s.columnVisibleEndCount.get();

      const bounds = new Map<number, Int32Array>();

      const rowScan = s.rowSpanScanDistance.get();
      const colScan = s.columnSpanScanDistance.get();

      const { columnStart, columnEnd, rowStart, rowEnd } = s.internal.virtBounds.get();

      const colMidStart = Math.max(columnStart - colScan, startCount);
      const colEndBegin = startCount + centerCount;
      const colEndFinish = startCount + centerCount + endCount;

      const coveredSoFar: Record<number, Set<number> | undefined> = {};

      const forced = s.columnForceMountedColumnIndices.get();

      const forceBeforeStart = forced.filter((c) => c >= startCount && c < colMidStart);
      const forceAfterStart = forced.filter((c) => c >= columnEnd && c < colEndBegin);

      const size =
        (startCount + endCount + colScan + (columnEnd - columnStart) + forced.length) * 4 + 1;

      const columnsWithRowSpan = s.columnsWithRowSpan.get();
      const columnsWithColSpan = s.columnsWithColSpan.get();
      const getColSpan = s.columnGetColSpan.get();
      const getRowSpan = s.columnGetRowSpan.get();

      const isFullWidth = s.internal.rowIsFullWidthInternal.get();

      process(0, topCount);
      process(Math.max(rowStart - rowScan, topCount), rowEnd);
      process(rowCount - bottomCount, rowCount);

      return bounds;

      function process(start: number, end: number) {
        for (let r = start; r < end; r++) {
          if (isFullWidth(r)) {
            const v = new Int32Array(2);

            v[0] = FULL_ENCODING;
            v[1] = END_ENCODING;

            // This is a full width row
            bounds.set(r, v);
            continue;
          }

          function processCols(start: number, end: number, cover: Set<number> | undefined) {
            for (let c = start; c < end; c++) {
              if (cover?.has(c)) continue;

              const colSpan = columnsWithColSpan.has(c) ? getColSpan(r, c) : 1;
              const rowSpan = columnsWithRowSpan.has(c) ? getRowSpan(r, c) : 1;

              markCoveredSpans(coveredSoFar, r, c, colSpan, rowSpan);
              encodeCell(v, pos, r, rowSpan, c, colSpan);
              pos += 4;
            }
          }

          const cover = coveredSoFar[r];
          const v = new Int32Array(size);
          let pos = 0;

          processCols(0, startCount, cover);

          for (let i = 0; i < forceBeforeStart.length; i++) {
            const c = forceBeforeStart[i];
            if (cover?.has(c)) continue;

            const colSpan = columnsWithColSpan.has(c) ? getColSpan(r, c) : 1;
            const rowSpan = columnsWithRowSpan.has(c) ? getRowSpan(r, c) : 1;

            markCoveredSpans(coveredSoFar, r, c, colSpan, rowSpan);
            encodeCell(v, pos, r, rowSpan, c, colSpan);
            pos += 4;
          }

          processCols(colMidStart, columnEnd, cover);

          for (let i = 0; i < forceAfterStart.length; i++) {
            const c = forceBeforeStart[i];
            if (cover?.has(c)) continue;

            const colSpan = columnsWithColSpan.has(c) ? getColSpan(r, c) : 1;
            const rowSpan = columnsWithRowSpan.has(c) ? getRowSpan(r, c) : 1;

            markCoveredSpans(coveredSoFar, r, c, colSpan, rowSpan);
            encodeCell(v, pos, r, rowSpan, c, colSpan);
            pos += 4;
          }

          processCols(colEndBegin, colEndFinish, cover);
          v[pos] = END_ENCODING;

          bounds.set(r, v);
        }
      }
    }),
  } satisfies {
    virtBounds: StoreEnterprise<D, E>["state"]["internal"]["virtBounds"];
    virtLayout: StoreEnterprise<D, E>["state"]["internal"]["virtLayout"];
  };
};

function encodeCell(
  v: Int32Array,
  offset: number,
  r: number,
  rowSpan: number,
  c: number,
  colSpan: number,
) {
  v[offset] = r;
  v[offset + 1] = rowSpan;
  v[offset + 2] = c;
  v[offset + 3] = colSpan;
}

function markCoveredSpans(
  coveredSoFar: Record<number, Set<number> | undefined>,
  r: number,
  c: number,
  colSpan: number,
  rowSpan: number,
) {
  // This cell spans
  if (colSpan > 1)
    for (let cs = c + 1; cs < c + colSpan; cs++) {
      coveredSoFar[r] ??= new Set();
      coveredSoFar[r]?.add(cs);
    }
  if (rowSpan > 1)
    for (let rs = r + 1; rs < r + rowSpan; rs++) {
      coveredSoFar[rs] ??= new Set();
      coveredSoFar[rs]?.add(c);
    }

  if (rowSpan > 1 && colSpan > 1) {
    for (let rs = r + 1; rs < r + rowSpan; rs++) {
      for (let cs = c + 1; cs < c + colSpan; cs++) {
        coveredSoFar[rs]?.add(cs);
      }
    }
  }
}
