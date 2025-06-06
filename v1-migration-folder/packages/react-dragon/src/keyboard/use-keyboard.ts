import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import {
  activeDragElement,
  activeDropAtom,
  dragDataAtom,
  dragKeyboardActive,
  dragKeyboardDropZone,
  dragPositionAtom,
  dropZonesAtom,
  store,
} from "../+globals.js";
import { resetDragState } from "../utils/reset-drag-state.js";
import type { DragData } from "../+types.js";

export function useKeyboard(
  setIsDragging: Dispatch<SetStateAction<boolean>>,
  {
    getItems,
    keyActivate = "Enter",
    keyDrop = "Enter",
    keyNext = "ArrowRight",
    keyPrev = "ArrowLeft",
  }: {
    readonly getItems: (el: HTMLElement) => DragData;
    readonly keyActivate?: string;
    readonly keyNext?: string;
    readonly keyPrev?: string;
    readonly keyDrop?: string;
  },
) {
  const onKeyDown = useEvent((e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    // If there are no mounted drop zones then we can just return. There are no potential
    // targets, hence we don't really have anywhere to drop to.
    if (dropZonesAtom.size === 0) return;

    const controller = new AbortController();
    const endDrag = () => {
      const current = store.get(dragKeyboardDropZone);
      current?.removeAttribute("data-drag-keyboard-focus");

      dropZonesAtom.get(current!)?.leave();
      setIsDragging(false);
      resetDragState();
      controller.abort();
    };

    if (!store.get(dragKeyboardActive) && e.key === keyActivate) {
      // Activate drag n drop via the keyboard
      // Any clicks deactivate it. The element losing focus will
      // also deactivate.
      store.set(dragKeyboardActive, true);
      store.set(activeDragElement, e.currentTarget as HTMLElement);
      store.set(dragPositionAtom, { x: -1, y: -1 });

      const data = getItems(e.currentTarget as HTMLElement);
      store.set(dragDataAtom, data);
      setIsDragging(true);
    } else if (store.get(dragKeyboardActive)) {
      // We don't support keyboard interactions with modifiers, so just return early.
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (e.key === "Escape") {
        endDrag();
        return;
      }

      const dropZones = [...dropZonesAtom.keys()];
      if (!dropZones.length) return;
      const current = store.get(dragKeyboardDropZone);

      if (e.key === keyDrop && current) {
        dropZonesAtom.get(current)!.drop();
        endDrag();
        return;
      }

      if (e.key === keyNext) {
        if (!current) {
          store.set(dragKeyboardDropZone, dropZones[0]);
        } else {
          const currentIndex = dropZones.indexOf(current);
          if (currentIndex === -1) store.set(dragKeyboardDropZone, dropZones[0]);
          else store.set(dragKeyboardDropZone, dropZones[(currentIndex + 1) % dropZones.length]);
        }

        const next = store.get(dragKeyboardDropZone);
        next?.scrollIntoView();
        store.set(activeDropAtom, next);

        current?.removeAttribute("data-drag-keyboard-focus");
        next?.setAttribute("data-drag-keyboard-focus", "true");

        dropZonesAtom.get(current!)?.leave();
        dropZonesAtom.get(next!)?.enter();
      }

      if (e.key === keyPrev) {
        if (!current) {
          store.set(dragKeyboardDropZone, dropZones.at(-1)!);
        } else {
          const currentIndex = dropZones.indexOf(current);
          if (currentIndex === -1) store.set(dragKeyboardDropZone, dropZones[0]);
          else {
            if (currentIndex === 0) store.set(dragKeyboardDropZone, dropZones.at(-1)!);
            else store.set(dragKeyboardDropZone, dropZones[currentIndex - 1]);
          }
        }

        const next = store.get(dragKeyboardDropZone);
        next?.scrollIntoView();
        store.set(activeDropAtom, next);

        current?.removeAttribute("data-drag-keyboard-focus");
        next?.setAttribute("data-drag-keyboard-focus", "true");

        dropZonesAtom.get(current!)?.leave();
        dropZonesAtom.get(next!)?.enter();
      }
    }

    (e.currentTarget as HTMLElement).addEventListener(
      "blur",
      () => {
        endDrag();
        return;
      },
      { signal: controller.signal },
    );
  });

  return onKeyDown;
}
