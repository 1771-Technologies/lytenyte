"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { createContext, useMemo, useState } from "react";

export interface CodeDemoProvider {
  readonly showCode: boolean;
  readonly setShowCode: Dispatch<SetStateAction<boolean>>;
}

export const Context = createContext<CodeDemoProvider>({ showCode: false, setShowCode: () => {} });

export const CodeDemoProvider = (props: PropsWithChildren) => {
  const [showCode, setShowCode] = useState(false);

  const value = useMemo(() => {
    return {
      showCode,
      setShowCode,
    };
  }, [showCode]);

  return <Context value={value}>{props.children}</Context>;
};
