import { tabbable } from "@1771technologies/lytenyte-focus";
import type { FocusEvent, KeyboardEvent } from "react";

export const handleFocusCapture = (e: FocusEvent) => {
  if (!e.currentTarget) return;
  const target = e.currentTarget as HTMLElement;
  if (!e.relatedTarget || target.contains(e.relatedTarget as any)) return;
  else target.focus();
};

export const handleKeyDown = (e: KeyboardEvent) => {
  if (!["Tab", "ArrowLeft", "ArrowRight"].includes(e.key)) return;

  const els = tabbable(e.currentTarget as any) as HTMLElement[];
  if (!els.length) return;

  if (e.key === "Tab") {
    const original = els.map((el) => {
      const o = el.getAttribute("tabindex");
      el.tabIndex = -1;

      return o;
    });
    requestAnimationFrame(() => {
      els.forEach((el, i) => {
        if (original[i] == null) el.removeAttribute("tabindex");
        else el.setAttribute("tabindex", original[i]);
      });
    });
  }

  if (e.key === "ArrowLeft") {
    const focused = els.indexOf(document.activeElement! as HTMLElement);
    if (focused === -1) els.at(-1)!.focus();
    else els[(focused + 1) % els.length].focus();
  }
  if (e.key === "ArrowRight") {
    const focused = els.indexOf(document.activeElement! as HTMLElement);
    if (focused === -1) els.at(0)!.focus();
    else els[(focused + 1) % els.length].focus();
  }
};
