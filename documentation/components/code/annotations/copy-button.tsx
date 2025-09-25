"use client";

import { cn } from "@/components/cn";
import { Check, ClipboardIcon } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text, className, ...props }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className={cn(
        "text-fd-muted-foreground absolute right-2 top-2 rounded p-1 hover:bg-gray-400/20",
        copied && "text-success-700 dark:text-shadow-fd-accent-foreground",
        className,
      )}
      aria-label="Copy to clipboard"
      {...props}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? <Check size={16} /> : <ClipboardIcon size={16} />}
    </button>
  );
}
