import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { useDragStore } from "./drag-store";
import { arrayOverlap } from "@1771technologies/js-utils";

export interface UseDroppableArgs {
  readonly id: string;
  readonly accepted: string[];
  readonly data: any;
  readonly active?: boolean;
}

export function useDroppable({ id, accepted, data, active = true }: UseDroppableArgs) {
  const [target, ref] = useState<HTMLElement | null>(null);
  const store = useDragStore();

  const over = useStore(store, (s) => s.active?.over.find((c) => c.id === id));
  const isNearestOver = useStore(store, (s) => s.active?.over.at(-1) === over);

  const canDrop = !!over?.canDrop;
  const isOver = !!over;
  const isTarget = useStore(store, (s) => arrayOverlap(s.active?.tags ?? [], accepted));

  useEffect(() => {
    if (!target || !active) return;

    store.setState((prev) => {
      if (prev.mounted.find((c) => c.id === id)) return prev;

      return {
        mounted: [...prev.mounted, { accepted, id, target, data }],
      };
    });

    return () =>
      store.setState((prev) => {
        return { mounted: prev.mounted.filter((c) => c.id !== id) };
      });
  }, [accepted, active, data, id, store, target]);

  return { ref, isOver, isTarget, canDrop, yHalf: over?.yHalf, xHalf: over?.xHalf, isNearestOver };
}
