/**
 * Debounce delays the execution of a function (`func`) by the specified `wait` time (in milliseconds).
 * Any additional calls to the debounced function during the wait period will reset the timer, ensuring
 * only one execution occurs at the end of the debounce period (or optionally at the beginning and/or end,
 * depending on the configuration).
 *
 * This is particularly useful for handling events that fire frequently over a short period, such as
 * user typing, window resizing, or scrolling events.
 *
 * ### Options
 * - `leading`: If true, the function will be called immediately at the start of the debounce period.
 * - `trailing`: If true, the function will be called at the end of the debounce period if the debounced
 *   function is called after the initial execution during the debounce delay. Defaults to `true`.
 * - If both `leading` and `trailing` are true, the function is called immediately for the first time,
 *   and a trailing call is made only if there are subsequent calls during the debounce period.
 *
 * ### Example Timeline (with `leading: false` and `trailing: true`):
 * Let `dfn` be our debounced function, and `run` denote when it executes:
 * ```
 * dfn **** cancel
 *  |        dfn *****  cancel
 *  |         |           |    dfn **** cancel
 *  |         |           |         |  dfn **** run
 *  |         |           |         |       |   dfn ***** run
 *  |         |           |         |       |       |       |
 * t1 ------ t2 ------- t3 ------- t4 ----- t5 ----- t6 ---- t7
 * ```
 * At:
 *  - `t1`: The first call to `dfn` happens.
 *  - `t2`: Another call to `dfn` happens, cancelling the first and restarting the wait timer.
 *  - `t3`: The debounce period has passed with no new calls, so the function executes at this point.
 *  - `t4`: A new call to `dfn` happens, restarting the debounce timer.
 *  - `t5`: Another call occurs, cancelling the previous timer.
 *  - `t6`: Another call occurs, again cancelling the previous timer.
 *  - `t7`: The debounce timer expires, and `dfn` executes with the latest parameters.
 *
 * ### Example Timeline (with `leading: true` and `trailing: true`):
 * ```
 * dfn **** execute
 *  |
 *  |               dfn  **** execute | run trailing
 *  |                       |         |
 *  |                       |         |               dfn ***** execute
 *  |                       |         |                       |
 *  |                       |         |                       |  dfn ***** run trailing
 *  |                       |         |                       |               |
 * t1 --------------------- t2 ------ t3 -------------------- t4 ------------ t5
 * ```
 * At:
 *  - `t1`: The first call to `dfn` happens, and it executes immediately due to `leading: true`.
 *  - `t2`: Another call is made during the debounce period, resetting the wait timer.
 *  - `t3`: The debounce timer expires, and `dfn` executes again (trailing call).
 *  - `t4`: A new call restarts the cycle with immediate execution due to `leading: true`.
 *  - `t5`: The final trailing execution is made after the debounce timer expires.
 */
export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {},
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<F> | null = null;
  let lastThis: unknown = null;
  let isLeadingCalled = false;

  const { leading = false, trailing = true } = options;

  const invokeFn = () => {
    if (lastArgs) {
      func.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  };

  const debounced = (...args: Parameters<F>): void => {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    const shouldCallLeading = leading && !isLeadingCalled;
    if (shouldCallLeading) {
      isLeadingCalled = true;
      invokeFn();
    }

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      if (trailing && (!leading || lastArgs !== null)) {
        invokeFn();
      }
      timeout = null;
      isLeadingCalled = false;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
    lastArgs = null;
    lastThis = null;
    isLeadingCalled = false;
  };

  debounced.flush = () => {
    invokeFn();
    debounced.cancel();
  };

  return debounced;
};
