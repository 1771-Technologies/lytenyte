import { makeColumnLayout, type ColumnView, type LayoutHeader } from "@1771technologies/lytenyte-shared";
import type { Props } from "../../types/types-internal";
import { useMemo } from "react";

export function useHeaderLayout(view: ColumnView, props: Props): LayoutHeader[][] {
  const fullHeaderLayout = useMemo(() => {
    return makeColumnLayout(view, props.floatingRowEnabled ?? false);
  }, [props.floatingRowEnabled, view]);

  return fullHeaderLayout;
}
