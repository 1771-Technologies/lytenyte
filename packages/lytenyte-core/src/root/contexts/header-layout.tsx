import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import type { Root } from "../root";
import type { PartialMandatory } from "@1771technologies/lytenyte-shared";
import { useColumnsContext } from "./columns/column-context.js";

interface HeaderLayoutType {
  readonly totalHeaderHeight: number;
  readonly headerGroupHeight: number;
  readonly headerHeight: number;
  readonly floatingHeight: number;
  readonly floatingEnabled: boolean;
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

  const value = useMemo<HeaderLayoutType>(() => {
    const headerGroupHeight = p.headerGroupHeight ?? 40;
    const headerHeight = p.headerHeight ?? 40;
    const floatingHeight = p.floatingRowEnabled ? (p.floatingRowHeight ?? 40) : 0;
    const totalHeaderHeight = (maxRow - 1) * headerGroupHeight + headerHeight + floatingHeight;
    return {
      totalHeaderHeight,
      headerGroupHeight,
      headerHeight,
      floatingHeight,
      floatingEnabled: p.floatingRowEnabled ?? false,
    };
  }, [maxRow, p.floatingRowEnabled, p.floatingRowHeight, p.headerGroupHeight, p.headerHeight]);

  return <context.Provider value={value}>{p.children}</context.Provider>;
});

export const useHeaderLayoutContext = () => useContext(context);
