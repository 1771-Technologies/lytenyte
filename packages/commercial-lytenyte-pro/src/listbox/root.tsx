import { useMemo, type PropsWithChildren } from "react";
import { context, type ListboxContext } from "./context";

export interface RootProps {
  readonly orientation?: "horizontal" | "vertical";
  readonly rtl?: boolean;
}

export function Root(props: PropsWithChildren<RootProps>) {
  const value = useMemo<ListboxContext>(() => {
    return {
      orientation: props.orientation ?? "vertical",
      rtl: props.rtl ?? false,
    };
  }, [props.orientation, props.rtl]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
}
