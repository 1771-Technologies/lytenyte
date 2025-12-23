import { forwardRef, Fragment, memo, useMemo, type JSX, type ReactNode } from "react";
import { RowChildrenDefault } from "../row-children-default.js";
import { useRowsContainerContext } from "../rows-container/context.js";
import type { LayoutRow } from "@1771technologies/lytenyte-shared";
import { useRoot, useRowLayout } from "../../../root/root-context.js";
import { $topCount, $topHeight } from "../../../selectors.js";
import { RowsSection } from "./rows-section.js";

export const RowsTop = memo(
  forwardRef<HTMLDivElement, RowsTop.Props>(function RowsTop(
    { children = RowChildrenDefault, ...props },
    forwarded,
  ) {
    const { id, totalHeaderHeight: top, topComponent: T } = useRoot();
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
        {T && <T />}
        {rows}
      </RowsSection>
    );
  }),
);

export namespace RowsTop {
  type Children = <T>(c: LayoutRow<T>) => ReactNode;

  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children };
}
