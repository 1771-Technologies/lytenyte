import { useEffect, useRef } from "react";
import { useBoundsContext } from "../../root/contexts/bounds.js";
import { useRowSourceContext } from "../../root/contexts/row-source-provider.js";
import { supportsScrollEnd } from "@1771technologies/dom-utils";

export function ViewMonitor({ viewport }: { viewport: HTMLElement }) {
  const source = useRowSourceContext();
  const boundsValue = useBoundsContext();

  const ref = useRef(boundsValue);
  ref.current = boundsValue;

  useEffect(() => {
    source.onViewChange(boundsValue);
  }, [boundsValue, source]);

  useEffect(() => {
    const controller = new AbortController();

    if (supportsScrollEnd(viewport)) {
      viewport.addEventListener("scrollend", () => source.onViewChange(ref.current), {
        signal: controller.signal,
      });
    } else {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      viewport.addEventListener(
        "scroll",
        () => {
          if (!timeout)
            timeout = setTimeout(() => {
              source.onViewChange(ref.current);
              timeout = null;
            }, 200);
        },
        { signal: controller.signal },
      );
    }

    return () => controller.abort();
  }, [source, viewport]);

  return null;
}
