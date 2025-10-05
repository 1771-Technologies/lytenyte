import type { CSSProperties, JSX } from "react";
import { forwardRef, useCallback, useMemo } from "react";
import type { Column } from "../+types";
import { TreeBranch } from "../tree-view/branch/branch.js";
import type { SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { ColumnItemContext } from "./context.js";
import { useGrid } from "../grid-provider/use-grid.js";
import { useColumnsFromContext } from "./use-columns-from-context.js";
import type { PathBranch } from "@1771technologies/lytenyte-shared";
import { dragState, DropWrap } from "@1771technologies/lytenyte-core/yinternal";

export interface ColumnManagerBranchProps {
  readonly item: PathBranch<Column<any>>;
  readonly label: SlotComponent;
  readonly expander?: SlotComponent<{ expanded: boolean; toggle: () => void }>;

  readonly labelWrapClassName?: string;
  readonly labelWrapStyle?: CSSProperties;
}

export const Branch = forwardRef<
  HTMLLIElement,
  ColumnManagerBranchProps & JSX.IntrinsicElements["li"]
>(function Branch({ item, label, labelWrapClassName, labelWrapStyle, ...props }, forwarded) {
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
    <ColumnItemContext value={useMemo(() => ({ item }), [item])}>
      <TreeBranch
        {...props}
        itemId={item.data.idOccurrence}
        ref={forwarded}
        onKeyDown={(ev) => {
          props.onKeyDown?.(ev);
          if (ev.key === " ") {
            toggle();
            ev.preventDefault();
          }
        }}
        labelWrap={
          <DropWrap
            data-ln-column-manager-branch
            data-ln-column-id={item.data.idOccurrence}
            accepted={[accepted]}
            className={labelWrapClassName}
            style={labelWrapStyle}
            onEnter={(el) => {
              const data = dragState.data
                .get()
                ?.siteLocalData?.[accepted]?.at(-1) as Column<any> | null;

              if (!data) return;

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
          />
        }
        label={label}
      />
    </ColumnItemContext>
  );
});
