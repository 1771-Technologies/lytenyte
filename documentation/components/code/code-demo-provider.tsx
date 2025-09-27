"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useMemo, useState } from "react";

export interface CodeDemoProvider {
  readonly showCode: boolean;
  readonly setShowCode: Dispatch<SetStateAction<boolean>>;
  readonly reset: number;
  readonly setReset: Dispatch<SetStateAction<number>>;
}

export const Context = createContext<CodeDemoProvider>({
  showCode: false,
  setShowCode: () => {},
} as any);

export const CodeDemoProvider = (props: PropsWithChildren) => {
  const [showCode, setShowCode] = useState(false);
  const [reset, setReset] = useState(0);

  const value = useMemo(() => {
    return {
      showCode,
      setShowCode,
      reset,
      setReset,
    };
  }, [reset, showCode]);

  return <Context value={value}>{props.children}</Context>;
};
