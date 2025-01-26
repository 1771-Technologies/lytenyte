import type { ApiEnterprise } from "@1771technologies/grid-types";

export const columnMenus = <D, E>(api: ApiEnterprise<D, E>) => {
  return {
    columnCloseFilterMenu: () => {
      const s = api.getState();

      s.internal.filterMenuColumn.set(null);
      s.internal.filterMenuTarget.set(null);
    },
    columnCloseMenu: () => {
      const s = api.getState();
      s.internal.columnMenuColumn.set(null);
      s.internal.columnMenuTarget.set(null);
    },
    columnOpenFilterMenu: (c, bb) => {
      const sx = api.getState();

      sx.internal.filterMenuColumn.set(c);
      sx.internal.filterMenuTarget.set(bb);
    },
    columnOpenMenu: (c, bb) => {
      const s = api.getState();

      s.internal.columnMenuColumn.set(c);
      s.internal.columnMenuTarget.set(bb);
    },
  } satisfies {
    columnCloseFilterMenu: ApiEnterprise<D, E>["columnFilterMenuClose"];
    columnCloseMenu: ApiEnterprise<D, E>["columnMenuClose"];
    columnOpenMenu: ApiEnterprise<D, E>["columnMenuOpen"];
    columnOpenFilterMenu: ApiEnterprise<D, E>["columnFilterMenuOpen"];
  };
};
