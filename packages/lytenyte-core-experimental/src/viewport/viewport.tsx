import { forwardRef, memo, useMemo, useState, type JSX } from "react";
import { useGridRoot } from "../root/context.js";
import { useCombinedRefs } from "../hooks/use-combine-refs.js";
import { useFocusPosition } from "../root/focus-position/focus-position-context.js";
import { useFocusTracking } from "./use-focus-tracking.js";
import { navigator } from "@1771technologies/lytenyte-shared";
import { useRowSource } from "../root/row-source/context.js";

function ViewportImpl(
  { children, ...props }: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const [vp, setVp] = useState<HTMLDivElement | null>(null);
  const { setViewport, rtl, id, api, columnMeta } = useGridRoot();
  const rs = useRowSource();

  const combined = useCombinedRefs(ref, setViewport, setVp);

  const focusActive = useFocusPosition();
  const [focused, vpFocused] = useFocusTracking(vp, focusActive, id);
  const shouldCapture = !focused && !vpFocused;
  const rowCount = rs.useRowCount();

  const handleNavigation = useMemo(() => {
    if (!vp) return () => {};

    return navigator({
      viewport: vp,
      gridId: id,
      scrollIntoView: api.scrollIntoView,
      getRootCell: api.cellRoot,
      isRowDetailExpanded: api.rowDetailExpanded,
      position: focusActive,

      downKey: "ArrowDown",
      upKey: "ArrowUp",
      nextKey: rtl ? "ArrowLeft" : "ArrowRight",
      prevKey: rtl ? "ArrowRight" : "ArrowLeft",
      endKey: "End",
      homeKey: "Home",
      pageDownKey: "PageDown",
      pageUpKey: "PageUp",

      columnCount: columnMeta.columnsVisible.length,
      rowCount,
    });
  }, [
    api.cellRoot,
    api.rowDetailExpanded,
    api.scrollIntoView,
    columnMeta.columnsVisible.length,
    focusActive,
    id,
    rowCount,
    rtl,
    vp,
  ]);

  return (
    <>
      <div
        {...props}
        role="grid"
        ref={combined}
        data-ln-viewport
        data-ln-gridid={id}
        onKeyDown={(e) => {
          props.onKeyDown?.(e);

          if (e.defaultPrevented || e.isPropagationStopped() || !vp) return;
          handleNavigation(e);
        }}
        style={{
          width: "100%",
          height: "100%",
          overflowX: "auto",
          overflowY: "auto",
          boxSizing: "border-box",
          direction: rtl ? "rtl" : "ltr",
          ...props.style,
        }}
      >
        {vp && children}
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
}

export const Viewport = memo(forwardRef(ViewportImpl));
