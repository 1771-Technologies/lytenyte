import type { Scope } from "../+types.js";

/**
 * Handles the error for a given scope calculation. If the error is not
 * handled then it will be rethrown.
 */
export function handleError(scope: Scope | null, error: unknown) {
  if (!scope || !scope._handlers) throw error;

  let i = 0;
  const len = scope._handlers.length;
  let currentError = error;

  for (i = 0; i < len; i++) {
    try {
      scope._handlers[i](currentError);

      // The error was not re-thrown, hence it was handled.
      // We can stop at this point and break out.
      break;
    } catch (error) {
      currentError = error;
    }
  }

  // Error was not handled by the error handlers, hence we re-throw it.
  if (i === len) throw currentError;
}
