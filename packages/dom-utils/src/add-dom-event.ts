interface DOMEventMap extends DocumentEventMap, WindowEventMap, HTMLElementEventMap {}

export const addDomEvent = <K extends keyof DOMEventMap>(
  target: EventTarget | null,
  eventName: K,
  handler: (event: DOMEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) => {
  const node = target;
  node?.addEventListener(eventName, handler as any, options);
  return () => {
    node?.removeEventListener(eventName, handler as any, options);
  };
};
