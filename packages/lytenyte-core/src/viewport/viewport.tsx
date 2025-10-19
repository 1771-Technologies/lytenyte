import { forwardRef, useMemo, type JSX } from "react";
import { useGridRoot } from "../context.js";
import { navigator } from "@1771technologies/lytenyte-shared";
import { beginEditing } from "./begin-editing.js";
import { useFocusTracking } from "./use-focus-tracking.js";
import { useCombinedRefs } from "../hooks/use-combine-refs.js";

export const Viewport = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Viewport(
  { children, style, ...props },
  forwarded,
) {
  const ctx = useGridRoot();

  const ref = useCombinedRefs(ctx.ref, forwarded);

  const vp = ctx.grid.state.viewport.useValue();
  const width = ctx.grid.state.widthTotal.useValue();
  const height = ctx.grid.state.heightTotal.useValue();
  const rtl = ctx.grid.state.rtl.useValue();
  const focusActive = ctx.grid.internal.focusActive;

  const [focused, vpFocused] = useFocusTracking(vp, focusActive, ctx.gridId);
  const shouldCapture = !focused && !vpFocused;

  const handleNavigation = useMemo(() => {
    if (!vp) return () => {};

    return navigator({
      viewport: vp,
      gridId: ctx.gridId,
      scrollIntoView: ctx.grid.api.scrollIntoView,
      getRootCell: ctx.grid.api.cellRoot,
      position: focusActive,

      downKey: "ArrowDown",
      upKey: "ArrowUp",
      nextKey: "ArrowRight",
      prevKey: "ArrowLeft",
      endKey: "End",
      homeKey: "Home",
      pageDownKey: "PageDown",
      pageUpKey: "PageUp",

      columnCount: ctx.grid.state.columnMeta.get().columnsVisible.length,
    });
  }, [
    ctx.grid.api.cellRoot,
    ctx.grid.api.scrollIntoView,
    ctx.grid.state.columnMeta,
    ctx.gridId,
    focusActive,
    vp,
  ]);

  return (
    <>
      <div
        tabIndex={0}
        {...props}
        onKeyDown={(e) => {
          handleNavigation(e.nativeEvent);
          // props.onKeyDown?.(e);
          // if (e.defaultPrevented || e.isPropagationStopped() || !vp) return;
          // handleNavigation({
          //   gridId: ctx.grid.state.gridId.get(),
          //   rtl,
          //   event: e,
          //   viewport: vp,
          //   topCount: ctx.grid.state.rowDataStore.rowTopCount.get(),
          //   centerCount: ctx.grid.state.rowDataStore.rowCenterCount.get(),
          //   getRootCell: ctx.grid.api.cellRoot,
          //   scrollIntoView: ctx.grid.api.scrollIntoView,
          //   focusActive: ctx.grid.internal.focusActive,
          //   columnCount: ctx.grid.state.columnMeta.get().columnsVisible.length,
          //   rowCount: ctx.grid.state.rowDataStore.rowCount.get(),
          //   isRowDetailExpanded: (r) => {
          //     const row = ctx.grid.api.rowByIndex(r);
          //     if (!row) return false;
          //     return ctx.grid.api.rowDetailIsExpanded(row);
          //   },
          // });
          // if (e.key === "Enter" || e.key.length === 1) {
          //   // We use a timeout to avoid setting the value on clicks. This can happen when a user types
          //   // a non-printable key.
          //   setTimeout(() => {
          //     beginEditing(ctx.grid, undefined, e.key === "Enter" ? undefined : e.key);
          //   });
          // }
          // if (e.key === "Backspace" || e.key === "Delete") {
          //   const focusPos = ctx.grid.internal.focusActive.get();
          //   if (focusPos?.kind === "cell")
          //     ctx.grid.api.editUpdate({
          //       column: focusPos.colIndex,
          //       rowIndex: focusPos.rowIndex,
          //       value: null,
          //     });
          // }
        }}
        onClick={(e) => {
          props.onClick?.(e);
          if (e.defaultPrevented) return;
          beginEditing(ctx.grid, "single");

          if (ctx.grid.state.rowSelectionActivator.get() === "single-click")
            ctx.grid.api.rowHandleSelect(e);
        }}
        onDoubleClick={(e) => {
          props.onDoubleClick?.(e);
          if (e.defaultPrevented) return;
          beginEditing(ctx.grid, "double-click");

          if (ctx.grid.state.rowSelectionActivator.get() === "double-click")
            ctx.grid.api.rowHandleSelect(e);
        }}
        role="grid"
        ref={ref}
        data-ln-viewport
        data-ln-gridid={ctx.gridId}
        style={{
          ...style,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          contain: "strict",
          width: "100%",
          height: "100%",
          overflowX: style?.overflowX ?? "auto",
          overflowY: style?.overflowY ?? "auto",
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        {vp && children}
        {/* Prevents layouts shifts when the viewport size has not been retrieved. */}
        {!vp && <div style={{ width, height }} />}
      </div>

      {shouldCapture && (
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
