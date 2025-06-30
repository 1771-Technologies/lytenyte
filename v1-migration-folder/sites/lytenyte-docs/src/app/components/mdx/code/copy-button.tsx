"use client";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { IconButton } from "../../ui/icon-button";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <IconButton
      className="absolute right-1 top-1"
      aria-label="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? <CheckIcon className="size-5" /> : <CopyIcon />}
    </IconButton>
  );
}
