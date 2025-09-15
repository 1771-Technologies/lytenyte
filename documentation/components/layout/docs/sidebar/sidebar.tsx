"use client";
import { useMediaQuery } from "fumadocs-core/utils/use-media-query";
import { ReactNode, useMemo } from "react";
import { Context, InternalContext } from "./internal-context";

export interface SidebarProps {
  /**
   * Open folders by default if their level is lower or equal to a specific level
   * (Starting from 1)
   *
   * @defaultValue 0
   */
  defaultOpenLevel?: number;

  /**
   * Prefetch links
   *
   * @defaultValue true
   */
  prefetch?: boolean;

  /**
   * Children to render
   */
  Content: ReactNode;

  /**
   * Alternative children for mobile
   */
  Mobile?: ReactNode;
}

export function Sidebar({ defaultOpenLevel = 0, prefetch = true, Mobile, Content }: SidebarProps) {
  const isMobile = useMediaQuery("(width < 1024px)") ?? false;
  const context = useMemo<InternalContext>(() => {
    return {
      defaultOpenLevel,
      prefetch,
      level: 1,
    };
  }, [defaultOpenLevel, prefetch]);

  return (
    <Context.Provider value={context}>
      {isMobile && Mobile != null ? Mobile : Content}
    </Context.Provider>
  );
}
