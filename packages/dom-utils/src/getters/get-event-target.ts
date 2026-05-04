function getComposedPath(event: any): EventTarget[] | undefined {
  return event.composedPath?.() ?? event.nativeEvent?.composedPath?.();
}

/**
 * Returns the event target, preferring the first element in the composed path to support shadow
 * DOM events.
 */
export function getEventTarget<T extends EventTarget>(
  event: Partial<Pick<UIEvent, "target" | "composedPath">>,
): T | null {
  const composedPath = getComposedPath(event);
  return (composedPath?.[0] ?? event.target) as T | null;
}
