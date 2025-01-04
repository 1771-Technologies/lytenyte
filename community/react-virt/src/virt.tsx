import type { SizeChange } from "@1771technologies/react-sizer";
import { Sizer } from "@1771technologies/react-sizer";
import { useEvent } from "@1771technologies/react-utils";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

export interface RendererProps<D> {
  readonly rowIndex: number;
  readonly data: D;
  readonly y: number;
}

export interface VirtProps<D> {
  readonly itemHeight: number;
  readonly data: D[];
  readonly focusedIndex?: number | null;
  readonly renderer: (p: RendererProps<D>) => ReactNode;
  readonly preventFlash?: boolean;
}
export function Virt<D>({
  data,
  focusedIndex,
  itemHeight,
  renderer: Row,
  preventFlash,

  ...props
}: VirtProps<D> & Omit<JSX.IntrinsicElements["div"], "ref">) {
  const [size, setSize] = useState<SizeChange | null>(null);

  const init = useCallback((_: HTMLElement, size: SizeChange) => {
    setSize(size);
  }, []);

  const [rowStart, setRowStart] = useState(0);
  const [rowEnd, setRowEnd] = useState(0);

  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const [y, setY] = useState(0);
  const handleScroll = useEvent(() => {
    if (!vp) return;
    const scrollTop = vp.scrollTop;

    const rowStart = Math.floor(scrollTop / itemHeight);
    const rowEnd = Math.ceil(size!.innerHeight / itemHeight) + rowStart;

    setY(scrollTop);
    setRowStart(Math.max(0, rowStart - 5));
    setRowEnd(Math.min(rowEnd + 5, data.length));
  });

  const rows = useMemo(() => {
    const rows: ReactNode[] = [];
    if (focusedIndex != null && focusedIndex < rowStart)
      rows.push(<Row rowIndex={focusedIndex} data={data[focusedIndex]} y={focusedIndex * y} />);

    for (let i = rowStart; i < rowEnd; i++) {
      rows.push(<Row key={i} rowIndex={i} data={data[i]} y={i * itemHeight} />);
    }

    if (focusedIndex != null && focusedIndex >= rowEnd)
      rows.push(<Row rowIndex={focusedIndex} data={data[focusedIndex]} y={focusedIndex * y} />);

    return rows;
  }, [Row, data, focusedIndex, itemHeight, rowEnd, rowStart, y]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll, vp]);

  return (
    <Sizer onInit={init} onSizeChange={setSize} {...props} onScroll={handleScroll} ref={setVp}>
      {preventFlash && (
        <>
          <div
            style={{
              position: "sticky",
              top: 0,
              height: 0,
              width: "100%",
              transform: `translate3d(0px, ${-y}px, 0px)`,
            }}
          >
            {rows}
          </div>

          <div
            style={{
              height: data.length * itemHeight,
              width: "100%",
              position: "relative",
              pointerEvents: "none",
            }}
          ></div>
        </>
      )}
      {!preventFlash && (
        <div style={{ height: data.length * itemHeight, width: "100%", position: "relative" }}>
          {rows}
        </div>
      )}
    </Sizer>
  );
}
