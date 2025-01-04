// https://github.com/scottrippey/react-use-event-hook
/**
MIT License

Copyright (c) 2022 Scott Rippey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
import React, { useInsertionEffect } from "react";

/** Represents any function type with any number of arguments and return type */
type AnyFunction = (...args: any[]) => any;

/**
 * A React hook that creates a stable event callback that automatically captures the latest props and state.
 *
 * Key features:
 * - Returns a stable function reference that remains identical between renders
 * - Eliminates the need for dependency arrays (unlike useCallback)
 * - Always captures the latest props/state values when the callback is invoked
 * - Safely handles Server-Side Rendering (SSR)
 *
 * @template TCallback - The type of the callback function
 * @param callback - The event callback function to stabilize
 * @returns A stable version of the callback that always accesses the latest props/state
 *
 * @example
 * ```tsx
 * function MyComponent({ value }: { value: string }) {
 *   const handleClick = useEvent((e: MouseEvent) => {
 *     // `value` will always be current, no dependency array needed
 *     console.log('Clicked with value:', value);
 *   });
 *
 *   return <button onClick={handleClick}>Click me</button>;
 * }
 * ```
 *
 * @remarks
 * This hook is particularly useful for:
 * - Event handlers that need access to current props/state
 * - Callbacks passed to child components where you want to avoid unnecessary re-renders
 * - Situations where useCallback's dependency array becomes unwieldy
 *
 * @throws {Error} If the callback is invoked during initial render (before mount)
 */
export function useEvent<TCallback extends AnyFunction>(callback: TCallback): TCallback {
  // Store the latest callback version to ensure we always have access to current props/state
  const latestRef = React.useRef<TCallback>(useEvent_shouldNotBeInvokedBeforeMount as any);
  useInsertionEffect(() => {
    latestRef.current = callback;
  }, [callback]);

  // Create a stable callback wrapper that delegates to the latest version
  // Uses useRef instead of useCallback to avoid array allocation on every render
  const stableRef = React.useRef<TCallback>(null as any);
  if (!stableRef.current) {
    stableRef.current = function (this: any) {
      // Preserve 'this' context and forward all arguments to the latest callback
      // eslint-disable-next-line prefer-rest-params
      return latestRef.current.apply(this, arguments as any);
    } as TCallback;
  }

  return stableRef.current;
}

/**
 * Error handler for invalid hook usage during the initial render phase.
 *
 * @internal
 * @throws {Error} Always throws to indicate invalid usage before component mount
 */
function useEvent_shouldNotBeInvokedBeforeMount() {
  throw new Error(
    "INVALID_USEEVENT_INVOCATION: the callback from useEvent cannot be invoked before the component has mounted.",
  );
}
