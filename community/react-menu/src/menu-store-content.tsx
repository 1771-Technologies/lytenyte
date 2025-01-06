import { cascada, signal, type Signal } from "@1771technologies/react-cascada";
import { createContext, useContext, useState, type PropsWithChildren } from "react";

interface MenuStore {
  readonly expandedIds: Signal<Set<string>>;
}

const context = createContext<MenuStore>({} as unknown as MenuStore);

export function MenuStoreProvider(p: PropsWithChildren) {
  const s = useState(() => {
    const store = cascada(() => {
      const expandedIds = signal(new Set<string>());

      return {
        expandedIds,
      };
    });

    return store.store;
  });

  return <context.Provider value={s[0]}>{p.children}</context.Provider>;
}

export const useMenuStore = () => useContext(context);
