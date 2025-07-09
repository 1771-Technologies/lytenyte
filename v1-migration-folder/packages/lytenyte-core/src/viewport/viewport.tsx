import { forwardRef, type JSX } from "react";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";
import { useGridRoot } from "../context";
import {
  handleNavigationKeys,
  handleSkipInner,
  useFocusTracking,
} from "@1771technologies/lytenyte-shared";
import type { Grid } from "../+types";
import type { InternalAtoms } from "../state/+types";

export const Viewport = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Viewport(
  { children, style, ...props },
  forwarded,
) {
  const ctx = useGridRoot();

  const ref = useForkRef(ctx.ref, forwarded);

  const vp = ctx.grid.state.viewport.useValue();
  const width = ctx.grid.state.widthTotal.useValue();
  const height = ctx.grid.state.heightTotal.useValue();
  const rtl = ctx.grid.state.rtl.useValue();

  const focused = useFocusTracking(vp, ctx.grid.internal.focusActive);

  return (
    <>
      <div
        tabIndex={0}
        {...props}
        onKeyDown={(e) => {
          handleSkipInner(e);
          props.onKeyDown?.(e);

          if (e.defaultPrevented) return;

          const ds = ctx.grid.state.rowDataStore;

          handleNavigationKeys(e, {
            vp: ctx.grid.state.viewport.get(),
            rowCount: ds.rowCount.get(),
            topCount: ds.rowTopCount.get(),
            centerCount: ds.rowCenterCount.get(),
            columnCount: ctx.grid.state.columnMeta.get().columnsVisible.length,
            focusActive: ctx.grid.internal.focusActive,
            id: ctx.grid.state.gridId.get(),
            layout: ctx.grid.internal.layout.get(),
            rtl: ctx.grid.state.rtl.get(),
            scrollIntoView: ctx.grid.api.scrollIntoView,
          });

          if (e.key === "Enter" || e.key.length === 1) {
            // We use a timeout to avoid setting the value on clicks. This can happen when a user types
            // a non-printable key.
            setTimeout(() => {
              beginEditing(ctx.grid, undefined, e.key === "Enter" ? undefined : e.key);
            });
          }
          if (e.key === "Backspace" || e.key === "Delete") {
            const focusPos = ctx.grid.internal.focusActive.get();
            if (focusPos?.kind === "cell")
              ctx.grid.api.editUpdate({
                column: focusPos.colIndex,
                rowIndex: focusPos.rowIndex,
                value: null,
              });
          }
        }}
        onClick={(e) => {
          props.onClick?.(e);
          if (e.defaultPrevented) return;

          beginEditing(ctx.grid, "single");
        }}
        onDoubleClick={(e) => {
          props.onDoubleClick?.(e);
          if (e.defaultPrevented) return;

          beginEditing(ctx.grid, "dbl-click");
        }}
        role="grid"
        ref={ref}
        data-ln-viewport
        style={{
          ...style,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          overflow: style?.overflow ?? "auto",
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        {vp && children}
        {/* Prevents layouts shifts when the viewport size has not been retrieved. */}
        {!vp && <div style={{ width, height }} />}
      </div>

      {!focused && (
        <div
          role="none"
          data-ln-focus-capture
          onFocusCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();

            vp?.focus();
          }}
          tabIndex={0}
        />
      )}
    </>
  );
});

function beginEditing<T>(
  grid: Grid<T> & { internal: InternalAtoms },
  activator?: "single" | "dbl-click",
  init?: any,
) {
  const focusPos = grid.internal.focusActive.get();
  const editMode = grid.state.editCellMode.get();
  const editActivator = grid.state.editClickActivator.get();
  if (focusPos?.kind !== "cell" || editMode === "readonly") return;
  if (activator && editActivator !== activator) return;

  const column = grid.api.columnFromIndex(focusPos.colIndex);
  if (!column) return;
  if (grid.api.editIsCellActive({ column, rowIndex: focusPos.rowIndex })) return;

  grid.api.editBegin({ column, rowIndex: focusPos.rowIndex, init });
}
