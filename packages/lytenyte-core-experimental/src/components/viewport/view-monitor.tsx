import { supportsScrollEnd } from "@1771technologies/lytenyte-shared";
import { useEffect } from "react";
import { useBounds, useRoot } from "../../root/root-context.js";

export function ViewMonitor({ viewport }: { viewport: HTMLElement }) {
  const { source } = useRoot();
  const bounds = useBounds();

  const boundsValue = bounds.useValue();
  useEffect(() => {
    source.onViewChange(boundsValue);
  }, [boundsValue, source]);

  useEffect(() => {
    const controller = new AbortController();

    if (supportsScrollEnd(viewport)) {
      viewport.addEventListener(
        "scrollend",
        () => {
          source.onViewChange(bounds.get());
        },
        { signal: controller.signal },
      );
    } else {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      viewport.addEventListener(
        "scroll",
        () => {
          if (!timeout)
            timeout = setTimeout(() => {
              source.onViewChange(bounds.get());
              timeout = null;
            }, 200);
        },
        { signal: controller.signal },
      );
    }

    return () => controller.abort();
  }, [bounds, source, viewport]);

  return null;
}
