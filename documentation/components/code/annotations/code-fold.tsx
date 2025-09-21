"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";

export function CodeFold(props: PropsWithChildren) {
  const [show, setShow] = useState(false);

  if (!show) {
    return <button onClick={() => setShow(true)}>...</button>;
  }

  return props.children;
}
