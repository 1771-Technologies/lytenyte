import { forwardRef, memo, useMemo, useState, type CSSProperties, type JSX } from "react";
import { useEdit, useRoot } from "../../root/root-context.js";
import { useCombinedRefs } from "../../hooks/use-combine-refs.js";
import { useFocusTracking } from "./use-focus-tracking.js";
import { getNearestFocusable, navigator, runWithBackoff } from "@1771technologies/lytenyte-shared";
import { beginEditing } from "./begin-editing.js";
import { RowDragMonitor } from "./row-drag-monitor.js";

const noop = () => {};
function ViewportImpl(
  { children, ...props }: JSX.IntrinsicElements["div"],
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const [vp, setVp] = useState<HTMLDivElement | null>(null);

  const {
    setViewport,
    editMode,
    editClickActivator,
    selectActivator,
    focusActive,
    source,
    rtl,
    id,
    api,
    view,
  } = useRoot();
  const edit = useEdit();

  const [focused, vpFocused] = useFocusTracking(vp, focusActive, id);

  const shouldCapture = !focused && !vpFocused;
  const rowCount = source.useRowCount();

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

      columnCount: view.visibleColumns.length,
      rowCount,
    });
  }, [
    api.cellRoot,
    api.rowDetailExpanded,
    api.scrollIntoView,
    focusActive,
    id,
    rowCount,
    rtl,
    view.visibleColumns.length,
    vp,
  ]);

  const combined = useCombinedRefs(ref, setViewport, setVp);

  return (
    <>
      <RowDragMonitor />
      <div
        {...props}
        role="grid"
        ref={combined}
        onClick={(ev) => {
          props.onClick?.(ev);
          if (ev.defaultPrevented) return;

          beginEditing(api, edit, focusActive.get(), editMode, editClickActivator, "single");

          if (selectActivator === "single-click") api.rowHandleSelect(ev);
        }}
        onDoubleClick={(ev) => {
          props.onClick?.(ev);
          if (ev.defaultPrevented) return;

          beginEditing(api, edit, focusActive.get(), editMode, editClickActivator, "double-click");
          if (selectActivator === "double-click") {
            api.rowHandleSelect(ev);
          }
        }}
        data-ln-viewport
        data-ln-has-start={view.startCount > 0 ? true : undefined}
        data-ln-gridid={id}
        onKeyDown={(e) => {
          props.onKeyDown?.(e);

          if (e.defaultPrevented || e.isPropagationStopped() || !vp) return;

          const isEditing = edit.activeEdit.get();
          if (e.key === "Tab" && isEditing) return;

          handleNavigation(e);

          if (!isEditing && editMode !== "readonly") {
            if (e.key === "Enter") {
              beginEditing(api, edit, focusActive.get(), editMode, editClickActivator);
              return;
            }
            if (e.key.length === 1 && e.key !== " ") {
              beginEditing(api, edit, focusActive.get(), editMode, editClickActivator, undefined, e.key);
              return;
            }
          }

          if (isEditing) {
            if (e.key === "Enter") {
              const active = document.activeElement as HTMLElement | null;
              const focusable = active ? getNearestFocusable(id, active) : null;
              if (focusable) {
                const rowIndex = Number.parseInt(focusable.getAttribute("data-ln-rowindex")!);
                if (rowCount - 1 == rowIndex) {
                  runWithBackoff(() => {
                    if (focusable?.getAttribute("data-ln-edit-active") === "true") return false;

                    focusable?.focus();
                    return true;
                  }, [0, 20, 40]);

                  edit.commit();
                } else {
                  // We don't commit the edit when moving down, since the edit will be committed when the
                  // cell blurs.
                  handleNavigation({
                    key: "ArrowDown",
                    ctrlKey: false,
                    metaKey: false,
                    preventDefault: noop,
                    stopPropagation: noop,
                  });
                }
              }

              return;
            }

            if (e.key === "Escape") {
              const active = document.activeElement as HTMLElement | null;
              const focusable = active ? getNearestFocusable(id, active) : null;
              edit.cancel();

              if (focusable)
                runWithBackoff(() => {
                  if (focusable?.getAttribute("data-ln-edit-active") === "true") return false;

                  focusable?.focus();
                  return true;
                }, [0, 20, 40]);
              return;
            }
          }
        }}
        style={
          {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            contain: "strict",
            width: "100%",
            height: "100%",
            overflowX: "auto",
            overflowY: "auto",
            boxSizing: "border-box",
            direction: rtl ? "rtl" : "ltr",
            ...props.style,
          } as CSSProperties
        }
      >
        {children}
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
