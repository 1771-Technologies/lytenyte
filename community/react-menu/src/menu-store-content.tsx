import { cascada, signal, type CascadaStore, type Signal } from "@1771technologies/react-cascada";
import { createContext, useContext, useState, type PropsWithChildren } from "react";

type MenuStore = {
  readonly expandedIds: Signal<Set<string>>;
  readonly updateExpansion: Signal<(id: string, newState: boolean) => void>;
};

type Store = CascadaStore<MenuStore>;

const context = createContext<Store>({} as unknown as Store);

export function MenuStoreProvider(p: PropsWithChildren) {
  const s = useState(() => {
    const store = cascada(() => {
      const expandedIds = signal(new Set<string>());

      const pendingExpansions = new Map<string, boolean>();
      const pendingTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

      const updateExpansion = signal((id: string, newState: boolean) => {
        const pendingTimeout = pendingTimeouts.get(id);
        if (pendingTimeout) clearTimeout(pendingTimeout);

        if (pendingExpansions.has(id)) pendingExpansions.delete(id);

        const c = setTimeout(() => {
          const next = pendingExpansions.get(id);

          expandedIds.set((prev) => {
            const n = new Set(prev);
            if (next) n.add(id);
            else n.delete(id);

            return n;
          });

          pendingTimeouts.delete(id);
          pendingExpansions.delete(id);
        }, 200);

        pendingExpansions.set(id, newState);
        pendingTimeouts.set(id, c);
      });

      return {
        expandedIds,
        updateExpansion,
      };
    });

    return store;
  });

  return <context.Provider value={s[0]}>{p.children}</context.Provider>;
}

export const useMenuStore = () => useContext(context);
