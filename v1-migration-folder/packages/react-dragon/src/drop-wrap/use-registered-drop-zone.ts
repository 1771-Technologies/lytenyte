import { useEffect } from "react";
import type { DropZone } from "../+types";
import { dropZonesAtom } from "../+globals";

interface UseRegisteredDropZoneArgs extends DropZone {
  readonly dropEl: HTMLElement | null;
}

export function useRegisteredDropZone({ dropEl, drop, enter, leave }: UseRegisteredDropZoneArgs) {
  useEffect(() => {
    if (!dropEl) return;

    dropZonesAtom.set(dropEl, { enter, leave, drop });

    return () => {
      dropZonesAtom.delete(dropEl);
    };
  }, [drop, dropEl, enter, leave]);
}
