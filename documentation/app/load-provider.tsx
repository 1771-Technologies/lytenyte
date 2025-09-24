"use client";

import type { PropsWithChildren } from "react";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

export function LoadProvider(props: PropsWithChildren) {
  return <ProgressProvider>{props.children}</ProgressProvider>;
}
