import { cascada, signal, type CascadaStore, type Signal } from "@1771technologies/react-cascada";
import { createContext, useContext, useState, type PropsWithChildren } from "react";

type MenuStore = {
  readonly activeId: Signal<string | null>;
  readonly setActiveId: Signal<(id: string | null) => void>;
};

type Store = CascadaStore<MenuStore>;

const context = createContext<Store>({} as unknown as Store);

export function MenuStoreProvider(p: PropsWithChildren) {
  const s = useState(() => {
    const store = cascada(() => {
      const activeId = signal<string | null>(null);

      let t: null | ReturnType<typeof setTimeout>;

      const setActiveId = signal<(id: string | null) => void>((id) => {
        if (t) clearTimeout(t);

        t = setTimeout(() => {
          activeId.set(id);
          t = null;
        }, 200);
      });

      return {
        activeId,
        setActiveId,
      };
    });

    return store;
  });

  return <context.Provider value={s[0]}>{p.children}</context.Provider>;
}

export const useMenuStore = () => useContext(context);
