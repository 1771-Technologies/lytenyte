import { useMemo, type PropsWithChildren } from "react";
import { makeColumnLayout } from "./column-layout.js";
import type { MakeColumnViewReturn } from "../column-view/column-view";
import { columnLayoutContext } from "./column-layout-context.js";

export function ColumnLayoutProvider<T>({
  view,
  floatingRowEnabled,
  children,
}: PropsWithChildren<{
  view: MakeColumnViewReturn<T>;
  floatingRowEnabled: boolean;
}>) {
  const fullHeaderLayout = useMemo(() => {
    return makeColumnLayout(view, floatingRowEnabled);
  }, [floatingRowEnabled, view]);

  return (
    <columnLayoutContext.Provider value={fullHeaderLayout}>{children}</columnLayoutContext.Provider>
  );
}
