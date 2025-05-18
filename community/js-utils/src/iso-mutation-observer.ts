/**
 * A no-op implementation of MutationObserver for server-side environments
 * where the DOM MutationObserver API is not available.
 *
 * @class
 */
class MutationObserverServerSafe {
  /**
   * No-op implementation of MutationObserver.observe()
   *
   * @returns {void}
   */
  observe(): void {}

  /**
   * No-op implementation of MutationObserver.disconnect()
   *
   * @returns {void}
   */
  disconnect(): void {}
}

/**
 * Isomorphic MutationObserver that works in both browser and server environments.
 * Returns the native MutationObserver in browser environments, and a no-op
 * implementation in server-side environments where MutationObserver is undefined.
 */
export const IsoMutationObserver =
  typeof MutationObserver === "undefined"
    ? (MutationObserverServerSafe as typeof MutationObserver)
    : MutationObserver;
