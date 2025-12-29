import { forwardRef, memo, useMemo, useState, type JSX, type ReactNode } from "react";
import { useHeaderRowTemplate } from "./use-header-row-template.js";
import { useHeaderColTemplate } from "./use-header-col-template.js";
import { HeaderRowRenderer } from "./header-row/header-row-renderer.js";
import { useVirtualizedHeader } from "./use-virtualized-header.js";
import { useHeaderCellReactNodes } from "./use-header-cell-react-nodes.js";
import type { LayoutHeader } from "@1771technologies/lytenyte-shared";
import { useBounds, useColumnLayout, useRoot } from "../../root/root-context.js";
import { $colEndBound, $colStartBound } from "../../selectors.js";
import { HeaderProvider, type HeaderContextType } from "./header-context.js";

function HeaderImpl({ children = HeaderRowRenderer, ...props }: Header.Props, ref: Header.Props["ref"]) {
  const {
    id,
    floatingRowEnabled,
    floatingRowHeight,
    headerGroupHeight,
    headerHeight,
    view,
    xPositions,
    focusActive,
  } = useRoot();
  const columnLayout = useColumnLayout();

  const bounds = useBounds();
  const colStartBound = bounds.useValue($colStartBound);
  const colEndBound = bounds.useValue($colEndBound);

  const gridRowTemplate = useHeaderRowTemplate(
    columnLayout.length,
    headerGroupHeight,
    headerHeight,
    floatingRowHeight,
    floatingRowEnabled,
  );
  const gridColTemplate = useHeaderColTemplate(view, xPositions);

  const [active, setActive] = useState<LayoutHeader | null>(null);
  const virtualizedHeaderCells = useVirtualizedHeader(
    columnLayout,
    active,
    colStartBound,
    colEndBound,
    focusActive,
  );
  const headerRows = useHeaderCellReactNodes(virtualizedHeaderCells, children);

  const value = useMemo<HeaderContextType>(() => {
    return {
      activeHeaderDrag: active,
      setActiveHeaderDrag: setActive,
    };
  }, [active]);

  return (
    <HeaderProvider value={value}>
      <div
        {...props}
        ref={ref}
        role="rowgroup"
        data-ln-header
        data-ln-gridid={id}
        data-ln-rowcount={columnLayout.length - (floatingRowEnabled ? 1 : 0)}
        data-ln-floating={floatingRowEnabled ? true : undefined}
        style={{
          width: xPositions.at(-1)!,
          minWidth: "100%",
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "grid",
          gridTemplateRows: gridRowTemplate,
          gridTemplateColumns: gridColTemplate,
          ...props.style,
        }}
      >
        {headerRows}
      </div>
    </HeaderProvider>
  );
}

export const Header = memo(forwardRef(HeaderImpl));

export namespace Header {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly children?: (cells: LayoutHeader[]) => ReactNode;
  };
}
