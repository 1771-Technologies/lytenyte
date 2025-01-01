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
    floatingFrameIsOpen: () => {
      return !!api.getState().internal.floatingFrameOpen.peek();
    },

    panelFrameOpen: (id, side) => {
      const s = api.getState();
      const frames = s.panelFrames.peek();
      const frame = frames[id];
      if (!frame) return;

      s.internal.panelFrameOpen.set(id);
      s.internal.panelFrameSide.set(side ?? "end");
    },
    panelFrameClose: () => {
      const s = api.getState();
      s.internal.panelFrameOpen.set(null);
      s.internal.panelFrameSide.set(null);
    },
    panelFrameIsOpen: () => !!api.getState().internal.panelFrameOpen.peek(),
  } satisfies {
    floatingFrameClose: ApiEnterprise<D, E>["floatingFrameClose"];
    floatingFrameIsOpen: ApiEnterprise<D, E>["floatingFrameIsOpen"];
    floatingFrameOpen: ApiEnterprise<D, E>["floatingFrameOpen"];
    panelFrameClose: ApiEnterprise<D, E>["panelFrameClose"];
    panelFrameIsOpen: ApiEnterprise<D, E>["panelFrameIsOpen"];
    panelFrameOpen: ApiEnterprise<D, E>["panelFrameOpen"];
  };
};
