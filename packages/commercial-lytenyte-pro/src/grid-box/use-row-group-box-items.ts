import { useMemo, type ReactNode } from "react";
import type { DropEventParams, Grid, RowGroupModelItem } from "../+types.js";
import type { GridBoxItem } from "./+types.js";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";

export interface UseRowGroupBoxItems<T> {
  readonly grid: Grid<T>;
  readonly orientation?: "horizontal" | "vertical";
  readonly dragPlaceholder?: (c: RowGroupModelItem<T>) => ReactNode;
  readonly hideColumnOnGroup?: boolean;
}

export function useRowGroupBoxItems<T>({
  grid,
  orientation,
  dragPlaceholder,
  hideColumnOnGroup = true,
}: UseRowGroupBoxItems<T>) {
  const rowGroupModel = grid.state.rowGroupModel.useValue();
  const gridId = grid.state.gridId.useValue();

  const items = useMemo<GridBoxItem<RowGroupModelItem<T>>[]>(() => {
    const groupId = `${gridId}-group`;

    return rowGroupModel
      .map<GridBoxItem | null>((c, i) => {
        const onDelete = () => {
          grid.state.rowGroupModel.set((prev) => prev.filter((x) => x !== c));
        };

        const onDrop = (p: DropEventParams) => {
          const target = c;
          const src = p.state.siteLocalData?.[groupId] as RowGroupModelItem<T>;

          const isRtl = grid.state.rtl.get();

          let isBefore: boolean;
          if (orientation === "horizontal") {
            isBefore = isRtl ? !p.moveState.leftHalf : p.moveState.leftHalf;
          } else {
            isBefore = p.moveState.topHalf;
          }

          const srcIndex = rowGroupModel.findIndex((x) => {
            if (typeof src !== typeof x) return;
            const cid = typeof src === "string" ? src : src.id;
            const xid = typeof x === "string" ? x : x.id;

            return cid === xid;
          });

          const targetIndex = rowGroupModel.indexOf(target);

          // This is an external
          if (srcIndex === -1) {
            grid.state.rowGroupModel.set((prev) => {
              const next = [...prev];
              next.splice(isBefore ? targetIndex : targetIndex + 1, 0, src);
              return next;
            });

            if (typeof src === "string" && hideColumnOnGroup) {
              grid.api.columnUpdate({ [src]: { hide: true } });
            }
          } else {
            grid.state.rowGroupModel.set((prev) => {
              const next = [...prev];
              next.splice(srcIndex, 1);

              const targetIndex = next.indexOf(target);
              next.splice(isBefore ? targetIndex : targetIndex + 1, 0, src);

              return next;
            });
          }
        };

        if (typeof c === "string") {
          const column = grid.api.columnById(c);
          if (!column) return null;

          return {
            dragData: { [groupId]: c },
            data: c,
            draggable: true,
            source: "groups",
            id: c,
            index: i,
            label: column.name ?? column.id,
            onAction: () => {},
            onDelete: onDelete,
            onDrop: onDrop,
            dragPlaceholder: dragPlaceholder ? () => dragPlaceholder(c) : undefined,
          };
        } else {
          return {
            dragData: { [groupId]: c },
            data: c,
            draggable: true,
            id: c.id,
            source: "groups",
            index: i,
            label: c.name ?? c.id,
            onAction: () => {},
            onDelete: onDelete,
            onDrop,
            dragPlaceholder: dragPlaceholder ? () => dragPlaceholder(c) : undefined,
          };
        }
      })
      .filter((c) => c !== null);
  }, [
    grid.api,
    grid.state.rowGroupModel,
    grid.state.rtl,
    gridId,
    hideColumnOnGroup,
    orientation,
    dragPlaceholder,
    rowGroupModel,
  ]);

  const onRootDrop = useEvent((p: DropEventParams) => {
    const groupId = `${gridId}-group`;
    const c = p.state.siteLocalData?.[groupId] as RowGroupModelItem<T>;
    if (!c) return;

    // Is the item in the model.
    const currentIndex = rowGroupModel.findIndex((x) => {
      if (typeof c !== typeof x) return;

      const cid = typeof c === "string" ? c : c.id;
      const xid = typeof x === "string" ? x : x.id;

      return cid === xid;
    });

    // We failed to find the item, so add it to the end. If
    if (currentIndex === -1) {
      grid.state.rowGroupModel.set((prev) => [...prev, c]);
      if (typeof c === "string" && hideColumnOnGroup) {
        grid.api.columnUpdate({ [c]: { hide: true } });
      }
    } else {
      grid.state.rowGroupModel.set((prev) => {
        const next = [...prev];
        next.splice(currentIndex, 1);
        next.push(c);
        return next;
      });
    }
  });

  return useMemo(() => {
    return {
      rootProps: {
        accepted: [`${gridId}-group`],
        onRootDrop,
        orientation,
        grid,
      },

      items,
    };
  }, [grid, gridId, items, onRootDrop, orientation]);
}
