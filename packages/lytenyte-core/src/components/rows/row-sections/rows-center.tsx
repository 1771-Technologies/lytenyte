import { forwardRef, Fragment, memo, useMemo, type JSX, type ReactNode } from "react";
import { NativeScroller } from "../scrollers/native-scroller.js";
import { RowChildrenDefault } from "../row-children-default.js";
import { useRowsContainerContext } from "../rows-container/context.js";
import { useRoot, useRowLayout } from "../../../root/root-context.js";
import { $centerCount, $centerHeight, $pinHeight, $topCount } from "../../../selectors.js";
import { RowsSection } from "./rows-section.js";
import type { LayoutRow } from "@1771technologies/lytenyte-shared";

export const RowsCenter = memo(
  forwardRef<HTMLDivElement, RowsCenter.Props>(function RowsCenter(
    { children = RowChildrenDefault, ...props },
    forwarded,
  ) {
    const { id, centerComponent: C } = useRoot();
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
      return <div role="presentation" style={{ height: `calc(100% - ${pinSectionHeights}px - 0px)` }} />;
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
          minHeight: `calc(100% - ${pinSectionHeights}px - 0px)`,
          minWidth: "100%",
          position: "relative",
        }}
      >
        <NativeScroller>
          {C && <C />}
          {rows}
        </NativeScroller>
      </RowsSection>
    );
  }),
);

export namespace RowsCenter {
  type Children = (c: LayoutRow) => ReactNode;

  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children };
}
