import type { AxeResults } from "axe-core";
import { useMemo } from "react";

export function useFlattenedAxeResults(
  results: AxeResults | null,
  key: "violations" | "passes" | "incomplete"
) {
  return useMemo(() => {
    const frame = document.querySelector("iframe") as HTMLIFrameElement;

    if (!frame || !results) return [];

    const doc = frame.contentDocument;
    if (!doc) return [];

    const playRoot = doc.getElementById("play-root");
    if (!playRoot) return null;

    return results[key].flatMap((v) => {
      const nodes = v.nodes.filter((c) => {
        if (c.target[0] !== "iframe") return false;

        const selector = c.target.slice(1).join(" ");
        if (!selector) return;

        const el = doc.querySelector(selector);

        return el && playRoot.contains(el);
      });

      return nodes.map((n) => {
        return {
          description: v.description,
          id: v.id,
          helpLink: v.helpUrl,
          selector: n.target.slice(1).join(" "),
        };
      });
    });
  }, [key, results]);
}
