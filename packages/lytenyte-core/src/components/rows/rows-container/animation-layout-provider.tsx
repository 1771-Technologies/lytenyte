import { useContext, useMemo, useRef, useState, type PropsWithChildren, type RefObject } from "react";
import { useRowChangesContext } from "../../../root/contexts/animations/row-changes-context.js";
import {
  useRowLayoutContext,
  useRowViewContext,
} from "../../../root/contexts/row-layout/row-layout-context.js";
import type { LayoutRow } from "@1771technologies/lytenyte-shared";
import { createContext } from "react";
import { useIsoEffect } from "../../../hooks/use-iso-effect.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useRowSourceContext } from "../../../root/contexts/row-source-provider.js";

const context = createContext<{ additionalLayouts: LayoutRow[]; animating: RefObject<Set<string>> }>({
  additionalLayouts: [],
  animating: { current: new Set<string>() },
});

export function AnimationLayoutProvider(props: PropsWithChildren) {
  const { moved } = useRowChangesContext();
  const rowLayout = useRowLayoutContext();
  const rs = useRowSourceContext();

  const view = useRowViewContext();

  const animating = useRef<Set<string>>(new Set());
  const marker = useRef({});

  const prevMove = useRef(moved);

  const [force, setForce] = useState(0);

  const additionalLayouts = useMemo(() => {
    void force;

    if (prevMove.current !== moved) {
      // Add the newly moved rows to our animation set.
      moved.forEach((x) => animating.current.add(x.id));
    }
    prevMove.current = moved;

    const idSet = new Set([
      ...view.center.map((x) => x.id),
      ...view.top.map((x) => x.id),
      ...view.bottom.map((x) => x.id),
    ]);

    // Will force a re-render
    marker.current = {};

    return [...animating.current.difference(idSet)]
      .map((x) => {
        const index = rs.rowIdToRowIndex(x);
        if (index == null) return null;

        return rowLayout.layoutByIndex(index);
      })
      .filter(Boolean) as LayoutRow[];
  }, [force, moved, rowLayout, rs, view.bottom, view.center, view.top]);

  const value = useMemo(() => {
    return { animating, additionalLayouts };
  }, [additionalLayouts]);

  const gridId = useGridIdContext();

  useIsoEffect(() => {
    const rows = document.querySelectorAll(`[data-ln-gridid="${gridId}"][data-ln-row="true"]`);
  }, [marker.current]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
}

export const useAnimationLayouts = () => useContext(context);
