import { makeColumnLayout, type ColumnView, type LayoutHeader } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import type { Root } from "../root";

export function useHeaderLayout(view: ColumnView, props: Root.Props): LayoutHeader[][] {
  const fullHeaderLayout = useMemo(() => {
    return makeColumnLayout(view, props.floatingRowEnabled ?? false);
  }, [props.floatingRowEnabled, view]);

  return fullHeaderLayout;
}
