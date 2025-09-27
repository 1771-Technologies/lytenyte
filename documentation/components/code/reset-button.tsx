"use client";

import { RefreshCwIcon } from "lucide-react";
import { useContext } from "react";
import { Context } from "./code-demo-provider";
import { Button } from "../ui/button";

export function ResetButton({ ...props }: { className?: string }) {
  const { setReset } = useContext(Context);

  return (
    <Button
      aria-label="Reset the demo"
      {...props}
      size="icon-xs"
      color="ghost"
      className="text-gray-800 dark:text-gray-600"
      onClick={() => {
        setReset((prev) => prev + 1);
      }}
    >
      <RefreshCwIcon />
    </Button>
  );
}
