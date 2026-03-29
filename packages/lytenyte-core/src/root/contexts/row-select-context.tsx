import { createContext, useContext, useMemo, useRef, type PropsWithChildren, type RefObject } from "react";

const context = createContext(null as unknown as RefObject<number | null>);
const contextSettings = createContext<{ readonly selectActivator: "single-click" | "double-click" | "none" }>(
  null as any,
);

export function SelectPivotProvider(
  props: PropsWithChildren<{
    readonly rowSelectionActivator: "single-click" | "double-click" | "none" | undefined;
  }>,
) {
  const selectPivot = useRef<number | null>(null);
  const settings = useMemo(
    () => ({
      selectActivator: props.rowSelectionActivator ?? "none",
    }),
    [props.rowSelectionActivator],
  );
  return (
    <context.Provider value={selectPivot}>
      <contextSettings.Provider value={settings}>{props.children}</contextSettings.Provider>
    </context.Provider>
  );
}

export const useSelectPivotRef = () => useContext(context);
export const useRowSelectionSettings = () => useContext(contextSettings);
