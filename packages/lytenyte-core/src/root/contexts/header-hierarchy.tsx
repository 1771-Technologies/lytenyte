import { createColumnLayout, type LayoutHeader } from "@1771technologies/lytenyte-shared";
import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import { useColumnsContext } from "./columns/column-context.js";

const context = createContext<LayoutHeader[][]>(null as any);

export const HeaderHierarchyProvider = memo(
  (props: PropsWithChildren<{ floatingRowEnabled: boolean | undefined }>) => {
    const { view } = useColumnsContext();

    const fullHeaderLayout = useMemo(() => {
      return createColumnLayout(view, props.floatingRowEnabled ?? false);
    }, [props.floatingRowEnabled, view]);

    return <context.Provider value={fullHeaderLayout}>{props.children}</context.Provider>;
  },
);

export const useHeaderHierarchyContext = () => useContext(context);
