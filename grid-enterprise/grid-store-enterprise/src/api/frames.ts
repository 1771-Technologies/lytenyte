import type { ApiEnterprise } from "@1771technologies/grid-types";

export const frames = <D, E>(api: ApiEnterprise<D, E>) => {
  return {
    floatingFrameOpen: (id) => {
      const s = api.getState();
      const frames = s.floatingFrames.peek();

      const frame = frames[id];
      if (!frame) return;

      s.internal.floatingFrameOpen.set(id);
    },
    floatingFrameClose: () => {
      api.getState().internal.floatingFrameOpen.set(null);
    },

    panelFrameOpen: (id) => {
      const s = api.getState();
      const frames = s.panelFrames.peek();
      const frame = frames[id];
      if (!frame) return;

      s.internal.panelFrameOpen.set(id);
    },
    panelFrameClose: () => {
      const s = api.getState();
      s.internal.panelFrameOpen.set(null);
    },
  } satisfies {
    floatingFrameClose: ApiEnterprise<D, E>["floatingFrameClose"];
    floatingFrameOpen: ApiEnterprise<D, E>["floatingFrameOpen"];
    panelFrameClose: ApiEnterprise<D, E>["panelFrameClose"];
    panelFrameOpen: ApiEnterprise<D, E>["panelFrameOpen"];
  };
};
