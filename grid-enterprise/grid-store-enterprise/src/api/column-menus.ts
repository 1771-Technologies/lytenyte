import type { ApiEnterprise } from "@1771technologies/grid-types";

export const columnMenus = <D, E>(
  api: ApiEnterprise<D, E>,
): {
  columnCloseMenu: ApiEnterprise<D, E>["columnMenuClose"];
  columnOpenMenu: ApiEnterprise<D, E>["columnMenuOpen"];
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
    columnCloseMenu: ApiEnterprise<D, E>["columnMenuClose"];
    columnOpenMenu: ApiEnterprise<D, E>["columnMenuOpen"];
  };
};
