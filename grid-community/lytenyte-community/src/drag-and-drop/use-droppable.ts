import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { store } from "./drag-store";
import { arrayOverlap } from "@1771technologies/js-utils";

export interface UseDroppableArgs {
  readonly id: string;
  readonly accepted: string[];
}

export function useDroppable({ id, accepted }: UseDroppableArgs) {
  const [target, ref] = useState<HTMLElement | null>(null);

  const over = useStore(store, (s) => s.active?.over.find((c) => c.id === id));

  const canDrop = !!over?.canDrop;
  const isOver = !!over;
  const isTarget = useStore(store, (s) => arrayOverlap(s.active?.tags ?? [], accepted));

  useEffect(() => {
    if (!target) return;

    store.setState((prev) => {
      return {
        mounted: [...prev.mounted, { accepted, id, target }],
      };
    });

    return () =>
      store.setState((prev) => {
        return { mounted: prev.mounted.filter((c) => c.id !== id) };
      });
  }, [accepted, id, target]);

  return { ref, isOver, isTarget, canDrop, yHalf: over?.yHalf, xHalf: over?.xHalf };
}
