import type { SizeChange } from "@1771technologies/react-sizer";
import { Sizer } from "@1771technologies/react-sizer";
import { useCombinedRefs, useEvent } from "@1771technologies/react-utils";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
  type ReactNode,
  type RefObject,
} from "react";

/**
 * Props for the row renderer function used by the Virt component.
 * @template D The type of data item being rendered
 */
export interface RendererProps<D> {
  /** Zero-based index of the row being rendered */
  readonly rowIndex: number;
  /** Data item corresponding to this row */
  readonly data: D;
  /** Vertical position of the row in pixels */
  readonly y: number;
  /** The row height settings */
  readonly height: number;
}

/**
 * Props for the Virt component.
 * @template D The type of data items in the list
 */
export interface VirtProps<D> {
  /** Fixed height of each row in pixels */
  readonly itemHeight: number;
  /** Array of data items to be virtualized */
  readonly data: D[];
  /** Optional index of a row that should always be rendered, regardless of viewport position */
  readonly focusedIndex?: number | null;
  /** Function to render each row, receiving position and data information */
  readonly renderer: (p: RendererProps<D>) => ReactNode;
  /**
   * When true, uses a different rendering strategy that prevents content flash during scrolling.
   * This may impact performance but provides smoother visual results.
   */
  readonly preventFlash?: boolean;
  /**
   * An index to initially scroll an item into view
   */
  readonly scrollIntoViewIndex?: number;
}

/**
 * A virtualized list component that efficiently renders large datasets by only mounting
 * rows that are visible within the viewport (plus a small buffer).
 *
 * @template D The type of data items in the list
 *
 * @example
 * ```tsx
 * interface RowData {
 *   id: string;
 *   content: string;
 * }
 *
 * const rowRenderer = ({ data, rowIndex, y }: RendererProps<RowData>) => (
 *   <div style={{ position: 'absolute', top: y }}>
 *     {data.content}
 *   </div>
 * );
 *
 * <Virt
 *   data={items}
 *   itemHeight={40}
 *   renderer={rowRenderer}
 *   preventFlash={true}
 * />
 * ```
 *
 * @remarks
 * - Uses window-based virtualization to maintain smooth scrolling performance
 * - Supports a focused index that remains mounted even when scrolled out of view
 * - Provides flash prevention option for smoother visual updates
 * - Automatically handles viewport size changes and scroll position
 *
 * @param props Component props combining VirtProps with standard div props (excluding ref)
 * @returns A virtualized scrollable list
 */
export function Virt<D>({
  data,
  focusedIndex,
  itemHeight,
  renderer: Row,
  preventFlash,
  elRef,
  scrollIntoViewIndex,

  ...props
}: VirtProps<D> &
  Omit<JSX.IntrinsicElements["div"], "ref"> & {
    elRef?: RefObject<HTMLDivElement | null> | ((el: HTMLDivElement | null) => void);
  }) {
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
    if (focusedIndex != null && focusedIndex < rowStart) {
      rows.push(
        <Row
          key={focusedIndex}
          rowIndex={focusedIndex}
          data={data[focusedIndex]}
          y={focusedIndex * itemHeight}
          height={itemHeight}
        />,
      );
    }

    for (let i = rowStart; i < rowEnd; i++) {
      rows.push(<Row key={i} rowIndex={i} data={data[i]} y={i * itemHeight} height={itemHeight} />);
    }

    if (focusedIndex != null && focusedIndex >= rowEnd)
      rows.push(
        <Row
          rowIndex={focusedIndex}
          data={data[focusedIndex]}
          y={focusedIndex * itemHeight}
          height={itemHeight}
        />,
      );

    return rows;
  }, [Row, data, focusedIndex, itemHeight, rowEnd, rowStart]);

  useEffect(() => {
    handleScroll();
  }, [handleScroll, vp, size]);

  const scrolled = useRef(false);
  useEffect(() => {
    if (!vp || scrollIntoViewIndex == null || scrolled.current) return;

    const t = setTimeout(() => {
      vp.scrollBy({ top: scrollIntoViewIndex * itemHeight });
      scrolled.current = true;

      setTimeout(() => {
        const child = vp.querySelector(`[data-rowindex="${scrollIntoViewIndex}"]`);
        if (child) {
          (child as HTMLElement).focus();
        }
      }, 30);
    }, 10);

    return () => clearTimeout(t);
  }, [itemHeight, scrollIntoViewIndex, vp]);

  const combinedRef = useCombinedRefs(setVp, elRef);

  return (
    <Sizer
      onInit={init}
      onSizeChange={setSize}
      {...props}
      onScroll={handleScroll}
      elRef={combinedRef}
    >
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
