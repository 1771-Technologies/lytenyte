import { useMemo, useState, type PropsWithChildren } from "react";
import type { MenuContext } from "./contexts/context-menu-root.js";
import { context } from "./contexts/context-menu-root.js";

export interface MenuRootProps {
  readonly timeEnter?: number;
  readonly timeExit?: number;
  readonly hoverOpenDelay?: number;
  readonly closeDelay?: number;
}

export function MenuRoot({ children, ...p }: PropsWithChildren<MenuRootProps>) {
  const [activeParent, setActiveParent] = useState<HTMLElement | null>(null);
  const [activeId, setActiveId] = useState<string[]>([]);

  const value = useMemo<MenuContext>(() => {
    return {
      activeParent,
      setActiveParent,

      activeIds: activeId,
      setActiveIds: setActiveId,

      hoverOpenDelay: p.hoverOpenDelay ?? 300,
      closeDelay: p.closeDelay ?? 100,
      timeEnter: p.timeEnter ?? 0,
      timeExit: p.timeExit ?? 0,
    };
  }, [activeId, activeParent, p.closeDelay, p.hoverOpenDelay, p.timeEnter, p.timeExit]);

  return <context.Provider value={value}>{children}</context.Provider>;
}
