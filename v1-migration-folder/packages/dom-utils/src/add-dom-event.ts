interface DOMEventMap extends DocumentEventMap, WindowEventMap, HTMLElementEventMap {}
type MaybeFn<T> = T | (() => T);

export const addDomEvent = <K extends keyof DOMEventMap>(
  target: MaybeFn<EventTarget | null>,
  eventName: K,
  handler: (event: DOMEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) => {
  const node = typeof target === "function" ? target() : target;
  node?.addEventListener(eventName, handler as any, options);
  return () => {
    node?.removeEventListener(eventName, handler as any, options);
  };
};
