import { forwardRef, Fragment, memo, useMemo, type JSX, type ReactNode } from "react";
import { NativeScroller } from "./scrollers/native-scroller.js";
import { useGridRoot } from "../root/context.js";
import { useRowLayout } from "../root/layout-rows/row-layout-context.js";
import type { LayoutRow } from "../types/layout.js";
import { RowChildrenDefault } from "./row-children-default.js";
import { useRowsContainerContext } from "./rows-container/context.js";
import {
  $botCount,
  $botHeight,
  $centerCount,
  $centerHeight,
  $pinHeight,
  $topCount,
  $topHeight,
} from "../selectors/selectors.js";

type Children = <T>(c: LayoutRow<T>) => ReactNode;

export const RowsTop = memo(
  forwardRef<
    HTMLDivElement,
    Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children }
  >(function RowsTop({ children = RowChildrenDefault, ...props }, forwarded) {
    const { id, headerHeightTotal: top } = useGridRoot();
    const layout = useRowLayout();
    const container = useRowsContainerContext();

    const topCount = container.useValue($topCount);
    const height = container.useValue($topHeight);

    const rows = useMemo(() => {
      const rows: ReactNode[] = [];

      for (let i = 0; i < layout.top.length; i++) {
        rows.push(<Fragment key={layout.top[i].id}>{children(layout.top[i])}</Fragment>);
      }

      return rows;
    }, [children, layout.top]);

    if (height <= 0) return null;

    return (
      <RowsSection
        {...props}
        ref={forwarded}
        rowFirst={topCount || -1}
        rowLast={topCount}
        role="rowgroup"
        data-ln-rows-top
        data-ln-gridid={id}
        style={{
          height,
          position: "sticky",
          top,
          zIndex: 4,
          minWidth: "100%",
          ...props.style,
        }}
      >
        {rows}
      </RowsSection>
    );
  }),
);

export const RowsCenter = memo(
  forwardRef<
    HTMLDivElement,
    Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children }
  >(function RowsCenter({ children = RowChildrenDefault, ...props }, forwarded) {
    const { id } = useGridRoot();
    const layout = useRowLayout();
    const container = useRowsContainerContext();

    const pinSectionHeights = container.useValue($pinHeight);
    const centerHeight = container.useValue($centerHeight);
    const rowCenterCount = container.useValue($centerCount);
    const rowTopCount = container.useValue($topCount);

    const rows = useMemo(() => {
      const rows: ReactNode[] = [];

      for (let i = 0; i < layout.center.length; i++) {
        rows.push(<Fragment key={layout.center[i].id}>{children(layout.center[i])}</Fragment>);
      }

      return rows;
    }, [children, layout.center]);

    if (centerHeight <= 0) {
      return (
        <div role="presentation" style={{ height: `calc(100% - ${pinSectionHeights}px - 4px)` }} />
      );
    }

    return (
      <RowsSection
        {...props}
        rowFirst={rowTopCount}
        rowLast={rowCenterCount + rowTopCount}
        ref={forwarded}
        role="rowgroup"
        data-ln-rows-center
        data-ln-gridid={id}
        style={{
          ...props.style,
          height: centerHeight,
          minHeight: `calc(100% - ${pinSectionHeights}px - 4px)`,
          minWidth: "100%",
          position: "relative",
        }}
      >
        <NativeScroller>{rows}</NativeScroller>
      </RowsSection>
    );
  }),
);

export const RowsBottom = memo(
  forwardRef<
    HTMLDivElement,
    Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children }
  >(function RowsBottom({ children = RowChildrenDefault, ...props }, forwarded) {
    const { id } = useGridRoot();
    const layout = useRowLayout();
    const container = useRowsContainerContext();

    const rowTopCount = container.useValue($topCount);
    const rowBottomCount = container.useValue($botCount);
    const rowCenterCount = container.useValue($centerCount);
    const height = container.useValue($botHeight);

    const rows = useMemo(() => {
      const rows: ReactNode[] = [];

      for (let i = 0; i < layout.bottom.length; i++) {
        rows.push(<Fragment key={layout.bottom[i].id}>{children(layout.bottom[i])}</Fragment>);
      }

      return rows;
    }, [children, layout.bottom]);

    if (height <= 0) return null;

    return (
      <RowsSection
        {...props}
        ref={forwarded}
        rowFirst={rowCenterCount + rowTopCount}
        rowLast={rowCenterCount + rowBottomCount + rowTopCount}
        role="rowgroup"
        data-ln-rows-bottom
        data-ln-gridid={id}
        style={{
          ...props.style,

          height,
          boxSizing: "border-box",
          position: "sticky",
          bottom: 0,
          zIndex: 3,
          minWidth: "100%",
        }}
      >
        {rows}
      </RowsSection>
    );
  }),
);

interface RowSectionProps {
  readonly rowFirst: number;
  readonly rowLast: number;
}

const RowsSection = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowSectionProps>(
  function RowsSection({ rowFirst, rowLast, ...props }, forwarded) {
    return (
      <div
        {...props}
        ref={forwarded}
        role="rowgroup"
        data-ln-row-first={rowFirst}
        data-ln-row-last={rowLast}
      />
    );
  },
);
