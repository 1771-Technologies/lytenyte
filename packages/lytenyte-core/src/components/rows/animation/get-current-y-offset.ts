export function getCurrentYOffsetAndCancelInflight(el: HTMLElement) {
  let currentAnimY = 0;
  const inflight = el.getAnimations();
  if (inflight.length > 0) {
    const raw = getComputedStyle(el).transform;
    if (raw !== "none") currentAnimY = new DOMMatrix(raw).m42;
  }

  return currentAnimY;
}
