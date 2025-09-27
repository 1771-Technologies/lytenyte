"use client";

import type { PropsWithChildren } from "react";
import { Fragment, useContext } from "react";
import { Context } from "./code-demo-provider";

export function Resettable(props: PropsWithChildren) {
  const { reset } = useContext(Context);
  return <Fragment key={reset}>{props.children}</Fragment>;
}
