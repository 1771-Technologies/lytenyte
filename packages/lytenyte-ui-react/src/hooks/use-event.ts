import React from "react";

type AnyFunction = (...args: any[]) => any;

const useInsertionEffect =
  typeof window !== "undefined" ? React.useInsertionEffect || React.useLayoutEffect : () => {};

export function useEvent<TCallback extends AnyFunction>(callback: TCallback): TCallback {
  const latestRef = React.useRef<TCallback>(doNotInvokeInRender as any);
  useInsertionEffect(() => {
    latestRef.current = callback;
  }, [callback]);

  const stableRef = React.useRef<TCallback>(null as any);
  if (!stableRef.current) {
    stableRef.current = function (this: any) {
      // eslint-disable-next-line prefer-rest-params
      return latestRef.current.apply(this, arguments as any);
    } as TCallback;
  }

  return stableRef.current;
}

function doNotInvokeInRender() {
  throw new Error("Don't invoke an event function in render.");
}
