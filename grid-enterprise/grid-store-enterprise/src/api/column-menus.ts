import type { ApiPro } from "@1771technologies/grid-types/pro";

export const columnMenus = <D, E>(
  api: ApiPro<D, E>,
): {
  columnCloseMenu: ApiPro<D, E>["columnMenuClose"];
  columnOpenMenu: ApiPro<D, E>["columnMenuOpen"];
} => {
  return {
    columnCloseMenu: () => {
      const s = api.getState();
      s.internal.columnMenuColumn.set(null);
      s.internal.columnMenuTarget.set(null);
    },
    columnOpenMenu: (c, bb) => {
      const s = api.getState();

      s.internal.columnMenuColumn.set(c);
      s.internal.columnMenuTarget.set(bb);
    },
  } satisfies {
    columnCloseMenu: ApiPro<D, E>["columnMenuClose"];
    columnOpenMenu: ApiPro<D, E>["columnMenuOpen"];
  };
};
