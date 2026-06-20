import { useMemo, useRef } from "react";
import { useYCoordinates } from "../../root/contexts/coordinates.js";
import { useRowSourceContext } from "../../root/contexts/row-source-provider.js";
import { useIsoEffect } from "../../hooks/use-iso-effect.js";
import { useRowLayoutContext, useRowViewContext } from "../../root/contexts/row-layout/row-layout-context.js";

export function RowAnimationDriver() {
  const rowLayout = useRowLayoutContext();
  const prevRowLayout = useRef(rowLayout);

  const view = useRowViewContext();
  const prevViewRef = useRef(view);

  const yPositions = useYCoordinates();
  const rs = useRowSourceContext();

  const idToPosition = useMemo(() => {
    const x: Record<string, number> = {};
    for (let i = 0; i < yPositions.length - 1; i++) {
      const row = rs.rowByIndex(i);
      const id = row.get()?.id;
      if (!id) continue;

      x[id] = yPositions[i];
    }

    return x;
  }, [rs, yPositions]);

  const prevIdToPosition = useRef(idToPosition);

  useIsoEffect(() => {
    // we need to track the previous layout to get a reference to the row node, since it might've been deleted from the current
    // node? Maybe for deleted nodes we actually just clone the element and animate it out. Essentially it becomes frozen in space then? ?
    const prevLayout = prevRowLayout.current;
    prevRowLayout.current = rowLayout;

    const prev = prevIdToPosition.current;
    prevIdToPosition.current = idToPosition;

    const prevView = prevViewRef.current;
    prevViewRef.current = view;

    const moved: { id: string; from: number; to: number }[] = [];
    const removed: { id: string }[] = [];
    const added: { id: string }[] = [];
  }, [idToPosition, view]);

  return <></>;
}
