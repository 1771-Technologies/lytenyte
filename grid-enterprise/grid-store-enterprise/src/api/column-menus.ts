import type { ApiEnterprise } from "@1771technologies/grid-types";

export const columnMenus = <D, E>(api: ApiEnterprise<D, E>) => {
  return {
    columnCloseFilterMenu: () => {
      const s = api.getState();

      s.internal.filterMenuColumn.set(null);
      api.eventFire("onColumnFilterMenuOpenChange", {
        api,
        column: s.internal.filterMenuColumn.peek(),
      });
    },
    columnCloseMenu: () => {
      const s = api.getState();
      const handle = s.internal.columnMenuHandle.peek();
      if (!handle) return;

      handle.close();
      api.eventFire("onColumnMenuOpenChange", { api, column: s.internal.columnMenuColumn.peek()! });
    },
    columnOpenFilterMenu: (c, bb) => {
      const sx = api.getState();

      sx.internal.filterMenuColumn.set(c);
      sx.internal.filterMenuTarget.set(bb);

      api.eventFire("onColumnFilterMenuOpenChange", { api, column: c });
    },
    columnOpenMenu: (c, bb) => {
      const s = api.getState();
      const handle = s.internal.columnMenuHandle.peek();
      if (!handle) return;

      handle.close();
      s.internal.columnMenuColumn.set(c);
      s.internal.columnMenuTarget.set(bb);
      api.eventFire("onColumnMenuOpenChange", { api, column: c });
    },
  } satisfies {
    columnCloseFilterMenu: ApiEnterprise<D, E>["columnFilterMenuClose"];
    columnCloseMenu: ApiEnterprise<D, E>["columnMenuClose"];
    columnOpenMenu: ApiEnterprise<D, E>["columnMenuOpen"];
    columnOpenFilterMenu: ApiEnterprise<D, E>["columnFilterMenuOpen"];
  };
};
