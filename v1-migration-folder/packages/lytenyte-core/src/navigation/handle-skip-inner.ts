import type { KeyboardEvent } from "react";

export function handleSkipInner(e: KeyboardEvent<HTMLElement>) {
  if (e.key === "Tab") {
    const el = e.currentTarget;
    el.inert = true;
    setTimeout(() => {
      el.inert = false;
    });
  }
}
