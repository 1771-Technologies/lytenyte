import { getDefaultStore } from "@1771technologies/atom";
import { tooltipQueue, tooltips } from "./+state.js";
import type { Tooltip } from "./+types.js";

function clearQueuedTooltip(id: string) {
  const timeout = tooltipQueue.get(id);
  if (timeout) {
    clearTimeout(timeout);
    tooltipQueue.delete(id);
  }
}

function updateTooltip(c: Tooltip) {
  const store = getDefaultStore();
  store.set(tooltips, (prev) => {
    const next = new Map(prev);
    next.set(c.id, c);
    return next;
  });
}
function removeTooltip(id: string) {
  const store = getDefaultStore();
  store.set(tooltips, (prev) => {
    const next = new Map(prev);
    next.delete(id);
    return next;
  });
}

export const show = (c: Tooltip) => {
  const store = getDefaultStore();

  clearQueuedTooltip(c.id);

  const current = store.get(tooltips);
  // The tooltip is already visible. So we don't begin the process of opening it.
  // Instead we immediately update it. This is useful for situations where the properties are
  // changed in someway.
  if (current.has(c.id)) {
    updateTooltip(c);
    return;
  }

  // Since the tooltip is not open, we begin the process of updating it. If there was already an
  // existing tooltip queue - it will be cleared already. If there is no show delay, we can show
  // the tooltip immediately without waiting - so thats what we do here.
  const timeout = setTimeout(() => {
    updateTooltip(c);
    clearQueuedTooltip(c.id);
    c.onShow?.();
  }, c.showDelay);
  tooltipQueue.set(c.id, timeout);
};

export const hide = (id: string, immediate?: boolean) => {
  const store = getDefaultStore();

  clearQueuedTooltip(id);

  const current = store.get(tooltips);

  const tooltip = current.get(id);
  // If the tooltip is not currently shown, we don't have to do anything special.
  if (!tooltip) return;

  // Begin the close process. If there is no hide delay, just immediately remove it, no need for
  // a timeout, since the user wants it gone immediately.
  const timeout = setTimeout(
    () => {
      removeTooltip(id);
      clearQueuedTooltip(id);
      tooltip.onHide?.();
    },
    immediate ? 0 : tooltip.hideDelay,
  );
  tooltipQueue.set(id, timeout);
};
