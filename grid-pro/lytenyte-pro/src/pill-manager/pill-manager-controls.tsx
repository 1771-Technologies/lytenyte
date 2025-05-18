import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

export interface PillManagerControls {
  activeRow: string | null;
  setActiveRow: Dispatch<SetStateAction<string | null>>;
  activePill: string | null;
  setActivePill: Dispatch<SetStateAction<string | null>>;
}

const context = createContext({} as unknown as PillManagerControls);

export function PillManagerControlsProvider(props: PropsWithChildren) {
  const [activeRow, setActiveRow] = useState<null | string>(null);
  const [activePill, setActivePill] = useState<null | string>(null);

  const m = useMemo(() => {
    return {
      activeRow,
      setActiveRow,
      activePill,
      setActivePill,
    };
  }, [activePill, activeRow]);

  return <context.Provider value={m}>{props.children}</context.Provider>;
}

export const usePillControls = () => useContext(context);
