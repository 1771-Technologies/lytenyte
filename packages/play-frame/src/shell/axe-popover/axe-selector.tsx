import { Badge } from "@radix-ui/themes";
import { useRef } from "react";

export function AxeSelector({ selector }: { selector: string }) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (
    <div
      style={{ marginLeft: "-4px", width: "fit-content", cursor: "crosshair" }}
      onMouseEnter={() => {
        if (fadeRef.current) {
          clearTimeout(fadeRef.current);
          fadeRef.current = null;
        }

        timeoutRef.current = setTimeout(() => {
          const doc = getIframeDoc();
          if (!doc) return;

          const element = doc.querySelector(selector);
          if (!element) return;

          element.classList.add("playframe-axe-scale-transition");
          element.classList.add("playframe-axe-scale");

          timeoutRef.current = null;
        }, 400);
      }}
      onMouseLeave={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const doc = getIframeDoc();

        doc?.body.classList.remove("fade-all");

        const elements = doc?.querySelectorAll(".playframe-axe-scale");

        elements?.forEach((c) => c.classList.remove("playframe-axe-scale"));

        fadeRef.current = setTimeout(() => {
          const doc = getIframeDoc();
          if (!doc) return;
          elements?.forEach((c) => c.classList.remove("playframe-axe-scale-transition"));
        });
      }}
    >
      <Badge size="1">{selector}</Badge>
    </div>
  );
}

function getIframeDoc() {
  const frame = document.querySelector("iframe");
  if (!frame) return;
  const doc = frame.contentDocument;
  if (!doc) return;

  return doc;
}
