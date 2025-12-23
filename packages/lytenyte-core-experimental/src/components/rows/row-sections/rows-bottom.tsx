import { forwardRef, Fragment, memo, useMemo, type JSX, type ReactNode } from "react";
import { RowChildrenDefault } from "../row-children-default.js";
import type { LayoutRow } from "@1771technologies/lytenyte-shared";
import { RowsSection } from "./rows-section.js";
import { useRoot, useRowLayout } from "../../../root/root-context.js";
import { useRowsContainerContext } from "../rows-container/context.js";
import { $botCount, $botHeight, $centerCount, $topCount } from "../../../selectors.js";

export const RowsBottom = memo(
  forwardRef<HTMLDivElement, RowsBottom.Props>(function RowsBottom(
    { children = RowChildrenDefault, ...props },
    forwarded,
  ) {
    const { id, bottomComponent: B } = useRoot();
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
        {B && <B />}
        {rows}
      </RowsSection>
    );
  }),
);

export namespace RowsBottom {
  type Children = <T>(c: LayoutRow<T>) => ReactNode;

  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children };
}
