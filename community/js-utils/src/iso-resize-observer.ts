/**
 * A no-op implementation of ResizeObserver for server-side environments
 * where the DOM ResizeObserver API is not available.
 *
 * @class
 */
class ResizeObserverServerSafe {
  /**
   * No-op implementation of ResizeObserver.observe()
   *
   * @returns {void}
   */
  observe(): void {}

  /**
   * No-op implementation of ResizeObserver.unobserve()
   *
   * @returns {void}
   */
  unobserve(): void {}

  /**
   * No-op implementation of ResizeObserver.disconnect()
   *
   * @returns {void}
   */
  disconnect(): void {}
}

/**
 * Isomorphic ResizeObserver that works in both browser and server environments.
 * Returns the native ResizeObserver in browser environments, and a no-op
 * implementation in server-side environments where ResizeObserver is undefined.
 */
export const IsoResizeObserver =
  typeof ResizeObserver === "undefined"
    ? (ResizeObserverServerSafe as typeof ResizeObserver)
    : ResizeObserver;
