import { SortManager } from "@1771technologies/grid-components";
import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import type { FloatingFrameReact } from "@1771technologies/grid-types/enterprise-react";
import { useMemo } from "react";

export const SortFloatingFrame: FloatingFrameReact<any> = {
  title: "Sort",
  component: (p) => {
    return <SortComponent api={p.api} />;
  },
};

function SortComponent<D>({ api }: { api: ApiEnterpriseReact<D> }) {
  const state = api.getState();
  const grid = useMemo(() => ({ api: api, state }), [api, state]);

  return (
    <SortManager
      grid={grid}
      onApply={() => api.floatingFrameClose()}
      onCancel={() => api.floatingFrameClose()}
    />
  );
}
