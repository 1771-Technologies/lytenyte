import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import type { Root } from "../root";
import type { PartialMandatory } from "@1771technologies/lytenyte-shared";
import { useColumnsContext } from "./columns/column-context.js";

interface HeaderLayoutType {
  readonly totalHeaderHeight: number;
}

const context = createContext({} as HeaderLayoutType);

type Props = Pick<
  PartialMandatory<Root.Props>,
  "headerGroupHeight" | "headerHeight" | "floatingRowEnabled" | "floatingRowHeight"
>;

export const HeaderLayoutProvider = memo((p: PropsWithChildren<Props>) => {
  const {
    view: { maxRow },
  } = useColumnsContext();

  const totalHeaderHeight = useMemo(() => {
    const headerGroupHeight = p.headerGroupHeight ?? 40;
    const headerHeight = p.headerHeight ?? 40;
    const floatingHeight = p.floatingRowEnabled ? (p.floatingRowHeight ?? 40) : 0;

    return (maxRow - 1) * headerGroupHeight + headerHeight + floatingHeight;
  }, [maxRow, p.floatingRowEnabled, p.floatingRowHeight, p.headerGroupHeight, p.headerHeight]);

  const value = useMemo<HeaderLayoutType>(() => {
    return {
      totalHeaderHeight,
    };
  }, [totalHeaderHeight]);

  return <context.Provider value={value}>{p.children}</context.Provider>;
});

export const useHeaderLayoutContext = () => useContext(context);
