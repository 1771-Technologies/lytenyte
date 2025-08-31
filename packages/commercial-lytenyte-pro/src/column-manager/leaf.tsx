import type { JSX } from "react";
import { forwardRef, useCallback, useMemo } from "react";
import { ColumnItemContext } from "./context";
import { TreeLeaf } from "../tree-view/leaf";
import type { Column } from "../+types";
import { dragState, DropWrap } from "@1771technologies/lytenyte-dragon";
import { useGrid } from "../grid-provider/use-grid";
import { useColumnsFromContext } from "./use-columns-from-context";
import type { PathLeaf } from "@1771technologies/lytenyte-shared";

export interface ColumnManagerLeafProps {
  readonly item: PathLeaf<Column<any>>;
}

export const Leaf = forwardRef<HTMLLIElement, ColumnManagerLeafProps & JSX.IntrinsicElements["li"]>(
  function ColumnManagerLeaf({ item, ...props }, forwarded) {
    const context = useMemo(() => {
      return { item: item };
    }, [item]);

    const grid = useGrid();
    const id = grid.state.gridId.useValue();

    const accepted = `${id}-columns`;

    const base = grid.state.columnBase.useValue();
    const columns = useColumnsFromContext(item);
    const isVisible = useMemo(() => {
      const allVisible = columns.every((c) => !(c.hide ?? base.hide));

      return allVisible;
    }, [base.hide, columns]);

    const toggle = useCallback(
      (s?: boolean) => {
        const next = s ?? isVisible;
        grid.api.columnUpdate(Object.fromEntries(columns.map((c) => [c.id, { hide: next }])));
      },
      [columns, grid.api, isVisible],
    );

    return (
      <ColumnItemContext.Provider value={context}>
        <DropWrap
          accepted={[accepted]}
          onEnter={(el) => {
            const data = dragState.data
              .get()
              ?.siteLocalData?.[accepted]?.at(-1) as Column<any> | null;

            if (!data) return;

            const columns = [item.data];

            const move = data.id;
            if (columns.some((c) => c.id === move)) return;

            const allColumns = grid.state.columns.get();
            const moveIndex = allColumns.findIndex((c) => c.id === move);
            if (moveIndex === -1) return;

            const thisIndex = allColumns.findIndex((c) => c.id === columns[0].id);

            const isBefore = thisIndex > moveIndex;

            // Flipped since our source is the one moving
            if (!isBefore) {
              el.setAttribute("data-ln-is-before", "true");
            } else {
              el.setAttribute("data-ln-is-after", "true");
            }
          }}
          onLeave={(el) => {
            el.removeAttribute("data-ln-is-before");
            el.removeAttribute("data-ln-is-after");
          }}
          as={
            <TreeLeaf
              {...props}
              itemId={item.data.id}
              ref={forwarded}
              onKeyDown={(ev) => {
                props.onKeyDown?.(ev);
                if (ev.key === " ") {
                  toggle();
                  ev.preventDefault();
                }
              }}
              data-ln-column-manager-leaf
              data-ln-column-id={item.data.id}
            />
          }
        />
      </ColumnItemContext.Provider>
    );
  },
);
