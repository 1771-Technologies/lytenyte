import type { PositionUnion } from "@1771technologies/lytenyte-shared";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

const context = createContext<[PositionUnion | null, Dispatch<SetStateAction<PositionUnion | null>>]>(
  null as any,
);
const contextNR = createContext<{
  get: () => PositionUnion | null;
  set: Dispatch<SetStateAction<PositionUnion | null>>;
}>(null as any);

export function FocusPositionProvider(props: PropsWithChildren) {
  const [focus, setFocus] = useState<PositionUnion | null>(null);
  const focusRef = useRef(focus);
  focusRef.current = focus;

  const focusNR = useMemo(() => {
    return {
      get: () => focusRef.current,
      set: setFocus,
    };
  }, []);
  const focusValue = useMemo(() => {
    return [focus, setFocus] as [PositionUnion | null, Dispatch<SetStateAction<PositionUnion | null>>];
  }, [focus]);

  return (
    <context.Provider value={focusValue}>
      <contextNR.Provider value={focusNR}>{props.children}</contextNR.Provider>
    </context.Provider>
  );
}

export const useFocusReactive = () => useContext(context);
export const useFocusNonReactive = () => useContext(contextNR);
