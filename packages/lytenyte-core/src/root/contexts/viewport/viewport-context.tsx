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

const contextScroll = createContext(false);

export const ViewportContext = memo((props: PropsWithChildren<{ suppressScrollFlash: boolean }>) => {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);

  const value = useMemo(() => {
    return { viewport, setViewport };
  }, [viewport]);

  return (
    <contextScroll.Provider value={props.suppressScrollFlash}>
      <context.Provider value={value}>{props.children}</context.Provider>
    </contextScroll.Provider>
  );
});

export const useViewportContext = () => useContext(context);
export const useSuppressScrollFlashContext = () => useContext(contextScroll);
