import type { Computation } from "../+types.js";
import { handleError } from "./handle-error.js";

/**
 * Will call all the dispose functions for a given computation
 * and then set the dispose value to null. This has the effect of
 * 'emptying' the disposables.
 */
export function emptyDisposal(scope: Computation) {
  try {
    if (Array.isArray(scope._disposal)) {
      for (let i = scope._disposal.length - 1; i >= 0; i--) {
        const callable = scope._disposal[i];
        callable.call(callable);
      }
    } else {
      scope._disposal?.call(scope._disposal);
    }

    scope._disposal = null;
  } catch (error) {
    handleError(scope, error);
  }
}
