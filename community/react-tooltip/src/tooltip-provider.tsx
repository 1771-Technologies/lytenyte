import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { Tooltip, type TooltipApi, type TooltipProps } from "./tooltip";
import { useEvent } from "@1771technologies/react-utils";
import type { Placement } from "@1771technologies/positioner";

export const context = createContext<TooltipApi | null>(null as unknown as TooltipApi | null);

export function TooltipProvider({
  children,
  ...props
}: PropsWithChildren<Omit<TooltipProps, "ref">>) {
  const [ref, setRef] = useState<TooltipApi | null>(null as unknown as TooltipApi);

  return (
    <context.Provider value={ref}>
      {children}
      <Tooltip ref={setRef} {...props} />
    </context.Provider>
  );
}

export const useTooltipApi = () => useContext(context);

export const useTooltip = (
  id: string,
  content: ReactNode,
  opts?: { offset?: number; placement?: Placement },
) => {
  const api = useTooltipApi();

  const show = useEvent((target: HTMLElement) => {
    api?.show({
      id,
      content,
      target,
      offset: opts?.offset,
      placement: opts?.placement,
    });
  });

  useEffect(() => {
    if (!api) return;
    api.update(id, content);
  }, [api, content, id]);

  return {
    onKeyDown: useEvent((ev: KeyboardEvent) => {
      if (ev.key === "Escape") api?.close(id);
    }),
    onPointerEnter: useEvent((ev: PointerEvent) => {
      show(ev.currentTarget as HTMLElement);
    }),
    onPointerLeave: useEvent(() => {
      api?.close(id);
    }),
    onBlur: useEvent(() => {
      api?.close(id);
    }),
    onFocus: useEvent((ev: FocusEvent) => {
      show(ev.currentTarget as HTMLElement);
    }),
  };
};
