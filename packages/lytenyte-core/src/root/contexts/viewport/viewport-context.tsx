import {
  createContext,
  memo,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

const context = createContext<{
  viewport: HTMLDivElement | null;
  setViewport: Dispatch<SetStateAction<HTMLDivElement | null>>;
}>(null as any);

export const ViewportContext = memo((props: PropsWithChildren) => {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);

  const value = useMemo(() => {
    return { viewport, setViewport };
  }, [viewport]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
});

export const useViewportContext = () => useContext(context);
