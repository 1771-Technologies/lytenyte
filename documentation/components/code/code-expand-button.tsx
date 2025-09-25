"use client";

import { useContext } from "react";
import { Context } from "./code-demo-provider";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/button";

export function CodeExpandButton() {
  const c = useContext(Context);
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => {
        c.setShowCode((prev) => !prev);
      }}
    >
      {c.showCode ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
      {c.showCode ? "Collapse Code" : "Expand Code"}
    </Button>
  );
}
