import type { PositionState, PositionUnion } from "@1771technologies/lytenyte-shared";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

interface PositionContextType {
  readonly get: () => PositionUnion | null;
  readonly set: Dispatch<SetStateAction<PositionUnion | null>>;
}
const positionContext = createContext(null as unknown as PositionContextType);
const positionNRContext = createContext(null as unknown as PositionState);

export const PositionProvider = ({
  position,
  setPosition,
  children,
}: PropsWithChildren<{
  position: PositionUnion | null;
  setPosition: Dispatch<SetStateAction<PositionUnion | null>>;
}>) => {
  const positionRef = useRef(position);
  positionRef.current = position;

  const state = useMemo(() => {
    return {
      get: () => positionRef.current,
      set: setPosition,
    };
  }, [setPosition]);

  const value = useMemo(() => {
    return { get: () => position, set: setPosition };
  }, [position, setPosition]);

  return (
    <positionContext.Provider value={value}>
      <positionNRContext.Provider value={state}>{children}</positionNRContext.Provider>
    </positionContext.Provider>
  );
};

export const usePosition = () => useContext(positionContext);
export const usePositionNR = () => useContext(positionNRContext);
